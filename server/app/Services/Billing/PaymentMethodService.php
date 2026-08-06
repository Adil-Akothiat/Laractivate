<?php
namespace App\Services\Billing;

use App\Models\PaymentMethod;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Stripe\StripeClient;

class PaymentMethodService
{
    protected StripeClient $stripe;

    public function __construct()
    {
        $this->stripe = new StripeClient(config('services.stripe.secret'));
    }

    /**
     * Get summary of current default payment method + SetupIntent client secret
     */
    public function getPaymentMethodSummary(User $user): array
    {
        // Ensure user exists as a customer in Stripe
        if (! $user->hasStripeId()) {
            $user->createAsStripeCustomer();
        }

        $defaultMethod = $user->paymentMethods()
            ->where('is_default', true)
            ->first();

        $setupIntent = $user->createSetupIntent();

        return [
            'payment_method' => $defaultMethod ? [
                'id' => $defaultMethod->id,
                'brand' => $defaultMethod->brand,
                'last_four' => $defaultMethod->last_four,
                'is_default' => $defaultMethod->is_default,
            ] : null,
            'has_active_subscription' => $user->subscribed('default'),
            'client_secret' => $setupIntent->client_secret,
        ];
    }

    /**
     * Sync and set a Stripe Payment Method as default (for UI updates & Checkout)
     */
    public function syncAndSetDefault(User $user, string $stripePaymentMethodId): PaymentMethod
    {
        // 1. Fetch card details from Stripe
        $stripePm = $this->stripe->paymentMethods->retrieve($stripePaymentMethodId);

        return DB::transaction(function () use ($user, $stripePaymentMethodId, $stripePm) {
            // 2. Update Cashier / Stripe Customer default payment method
            $user->updateDefaultPaymentMethod($stripePaymentMethodId);

            // 3. Unset existing default flags in DB
            $user->paymentMethods()->update(['is_default' => false]);

            // 4. Create or update local record
            return $user->paymentMethods()->updateOrCreate(
                ['stripe_payment_method_id' => $stripePaymentMethodId],
                [
                    'provider' => 'stripe',
                    'type' => $stripePm->type ?? 'card',
                    'last_four' => $stripePm->card->last4 ?? null,
                    'brand' => $stripePm->card->brand ?? null,
                    'is_default' => true,
                ]
            );
        });
    }

    /**
     * Remove payment methods if user has no active subscription
     */
    public function removePaymentMethod(User $user): void
    {
        if ($user->subscribed('default')) {
            throw new \Exception('Cannot remove payment method while subscription is active.', 422);
        }

        DB::transaction(function () use ($user) {
            // Detach from Stripe via Cashier
            $user->deletePaymentMethods();

            // Delete local records
            $user->paymentMethods()->delete();
        });
    }

    /**
     * Helper: Extract PaymentMethod ID from a Stripe Checkout Session object
     */
    public function extractPaymentMethodIdFromSession(object $session): ?string
    {
        if (is_string($session->payment_method ?? null)) {
            return $session->payment_method;
        }

        if (isset($session->payment_method->id)) {
            return $session->payment_method->id;
        }

        if (! empty($session->subscription)) {
            $subscription = $this->stripe->subscriptions->retrieve($session->subscription);
            if (! empty($subscription->default_payment_method)) {
                return is_string($subscription->default_payment_method)
                    ? $subscription->default_payment_method
                    : $subscription->default_payment_method->id;
            }
        }

        if (! empty($session->setup_intent)) {
            $setupIntent = $this->stripe->setupIntents->retrieve($session->setup_intent);
            return is_string($setupIntent->payment_method)
                ? $setupIntent->payment_method
                : $setupIntent->payment_method->id ?? null;
        }

        if (! empty($session->payment_intent)) {
            $paymentIntent = $this->stripe->paymentIntents->retrieve($session->payment_intent);
            return is_string($paymentIntent->payment_method)
                ? $paymentIntent->payment_method
                : $paymentIntent->payment_method->id ?? null;
        }

        return null;
    }
}