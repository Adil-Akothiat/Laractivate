<?php

namespace App\Services\Billing;

use App\Models\User;
use Illuminate\Support\Facades\Log;
use Exception;
use Stripe\Checkout\Session as StripeSession;
use Stripe\Stripe;
use Stripe\StripeClient;

class CheckoutService
{
    protected StripeClient $stripe;
    public function __construct() {
        $this->stripe = new StripeClient(config('cashier.secret') ?? env('STRIPE_API_KEY'));
    }

    public function createPortalSession(User $user): string
    {
        if (!$user->stripe_id) {
            throw new \Exception("The user does not possess an active payment profile history.", 422);
        }

        // Generate hosted customer configuration portal link 
        $portal = $user->redirectToBillingPortal(
            config('services.client.url') . '/dashboard/pricing'
        );

        return $portal->getTargetUrl();
    }
    // /**
    //  * Process initial checkout fulfillment and map elements to database rows.
    //  */
    public function handleCheckoutSessionCompleted(object $session): bool
    {
        $userId = $session->client_reference_id ?? null;
        $stripeCustomerId = $session->customer ?? null;
        $stripeSubscriptionId = $session->subscription ?? null;

        // Log::info('')
        if (!$userId) {
            Log::warning('Stripe session missing client_reference_id mapping.');
            return false;
        }

        $user = User::where('id', $userId)->first();
        if (!$user) {
            Log::error("User ID {$userId} not found during checkout fulfillment mapping.");
            return false;
        }

        // Save Stripe Customer ID to the user record for future matching references
        $user->update(['stripe_id' => $stripeCustomerId]);
        Log::info('DATA', [
            'session'=> $session,
            'stripecustomerid'=> $stripeCustomerId,
            'stripesubscriptionid'=> $stripeSubscriptionId
        ]);
        $this->setDefaultPaymentMethod($session, $stripeCustomerId, $stripeSubscriptionId);
        return true;
    }

    public function setDefaultPaymentMethod(object $session, string $stripeCustomerId, string $stripeSubscriptionId) {
        try {
            $fullSession = $this->stripe->checkout->sessions->retrieve($session->id, [ 
            'expand' => ['payment_intent.payment_method', 'subscription'] 
            ]);

            Log::info('FULLSESSION', ['fullsession'=> $fullSession]);

            $paymentMethodId = null;
            if ($fullSession->payment_intent && $fullSession->payment_intent->payment_method):
                $paymentMethodId = $fullSession->payment_intent->payment_method->id;
            elseif ($fullSession->subscription && $fullSession->subscription->default_payment_method):
                $paymentMethodId = $fullSession->subscription->default_payment_method;
            elseif ($fullSession->setup_intent && $fullSession->setup_intent->payment_method):
                $paymentMethodId = $fullSession->setup_intent->payment_method;
            endif;
            
            if (!$paymentMethodId) {
                Log::warning("No payment method found in checkout session {$session->id}");
                return;
            }

            Log::info('PM', ['pm'=> $paymentMethodId]);

            $this->stripe->customers->update(
                $stripeCustomerId, 
                [
                    'invoice_settings' => [
                        'default_payment_method' => $paymentMethodId,
                    ],
                ]
            );

            if($stripeSubscriptionId):
                $this->stripe->subscriptions->update($stripeSubscriptionId, [
                    'default_payment_method' => $paymentMethodId
                ]);
            endif;

            Log::info("Set payment method {$paymentMethodId} as default for customer {$stripeCustomerId}");


        } catch (\Exception $e) {
            Log::error('error', ['message'=> $e->getMessage()]);
        }

    }

    public function createCheckoutSession(User $user, string $planSlug): string
    {
        $planService = app(PlanService::class);
        $targetPlan = $planService->getPlan($planSlug);
        if(!$targetPlan):
            throw new \Exception("The selected subscription plan configuration does not exist.", 422);
        endif;

        $stripePriceId = $targetPlan['price_id'];
        $slug = $targetPlan['slug'];

        $user->createOrGetStripeCustomer();
        
        $checkout = $user->newSubscription($slug, $stripePriceId)
            ->checkout([
                'client_reference_id'=> (string) $user->id,
                'success_url' => config('services.client.url') . '/dashboard/pricing?session_id={CHECKOUT_SESSION_ID}&status=success',
                'cancel_url'  => config('services.client.url') . '/dashboard/pricing?status=cancelled',
                'payment_method_collection' => 'if_required',
                'saved_payment_method_options' => [
                    'payment_method_save' => 'enabled',
                    'payment_method_remove' => 'enabled',
                    'allow_redisplay_filters' => ['always']
                ],
                'customer_update' => [
                    'name' => 'auto',
                    'address' => 'auto'
                ]
        ]);
        return $checkout->url;
    }

    protected function resolveUserFromSession(object $session): ?User
    {
        if (! empty($session->customer)) {
            $user = User::where('stripe_id', $session->customer)->first();
            if ($user) return $user;
        }

        if (! empty($session->client_reference_id)) {
            return User::find($session->client_reference_id);
        }

        return null;
    }
}