<?php

namespace App\Services\Billing;

use App\Models\{User, PlanPrice, Subscription, SubscriptionItem, Invoice, TaxRate, PaymentMethod};
use Illuminate\Support\Facades\Log;
use Stripe\Webhook;
use Stripe\Exception\SignatureVerificationException;
use UnexpectedValueException;
use Carbon\Carbon;
use Exception;

class BillingService
{
    /**
     * Generate a Stripe Checkout Session URL for a User.
     */
    public function createCheckoutSession(User $user, string $planSlug): string
    {
        $plan = config("billing.plans.{$planSlug}");

        if (!$plan) {
            throw new Exception('Selected plan layout not found.', 422);
        }

        $clientUrl = config('services.client.url');

        // Ask Cashier to build the checkout object
        $checkout = $user->newSubscription($plan['slug'], $plan['price_id'])
            ->checkout([
                'success_url'         => $clientUrl . '/dashboard/billing?success=true',
                'cancel_url'          => $clientUrl . '/dashboard/billing?cancelled=true',
                'client_reference_id' => $user->id,
            ]);

        return $checkout->url;
    }

    public function createPortalSession(User $user): string
    {
        if (!$user->stripe_id) {
            throw new Exception("The user does not possess an active payment profile history.", 422);
        }

        // Generate hosted customer configuration portal link 
        $portal = $user->redirectToBillingPortal(
            config('services.client.url') . '/dashboard/billing'
        );

        return $portal->getTargetUrl();
    }

    /**
     * Verify the cryptographic signature of an incoming Stripe webhook payload.
     */
    public function verifyWebhookPayload(string $payload, ?string $sigHeader): \Stripe\Event
    {
        $endpointSecret = config('services.stripe.webhook_secret');

        if (empty($sigHeader) || empty($endpointSecret)) {
            throw new SignatureVerificationException('Missing signature header or local verification secret key config.');
        }

        return Webhook::constructEvent($payload, $sigHeader, $endpointSecret);
    }

    /**
     * Process initial checkout fulfillment and map elements to database rows.
     */
    public function handleCheckoutSessionCompleted(object $session): bool
    {
        $userId = $session->client_reference_id;
        $stripeCustomerId = $session->customer;
        $stripeSubscriptionId = $session->subscription;

        if (!$userId) {
            Log::warning('Stripe session missing client_reference_id mapping.');
            return false;
        }

        $user = User::find($userId);
        if (!$user) {
            Log::error("User ID {$userId} not found during checkout fulfillment mapping.");
            return false;
        }

        // Save Stripe Customer ID to the user record for future matching references
        $user->update(['stripe_id' => $stripeCustomerId]);

        Log::info("🚀 User ID {$userId} successfully completed subscription checkout.");
        return true;
    }

    /**
     * Synchronize structural lifecycle modifications (status transitions, plan upgrades, trials).
     */
    public function handleSubscriptionUpdated(object $subscriptionData): bool
    {
        $stripeSubscriptionId = $subscriptionData->id;
        $stripeCustomerId = $subscriptionData->customer;
        $stripePriceId = $subscriptionData->items->data[0]->price->id ?? null;
        $status = $subscriptionData->status;
        $quantity = $subscriptionData->items->data[0]->quantity ?? 1;

        $user = User::where('stripe_id', $stripeCustomerId)->first();
        if (!$user) {
            Log::error("Stripe Webhook Error: User record match missing for Customer Reference: {$stripeCustomerId}");
            return false;
        }

        // Approach A Lookup Step: Map Stripe string token token back to our local integer ID
        $planPrice = PlanPrice::where('stripe_price_id', $stripePriceId)->first();
        if (!$planPrice) {
            Log::error("Stripe Webhook Error: Local PlanPrice row not found for Price Token: {$stripePriceId}");
            return false;
        }
    
        $trialEndsAt = isset($subscriptionData->trial_end) ? Carbon::createFromTimestamp($subscriptionData->trial_end) : null;

        // 2. 🟢 Professional Grace Period & Expiration Parsing
        $endsAt = null;

        if ($subscriptionData->cancel_at_period_end):
            // The user canceled, but has prepaid access until the period finishes (Grace Period)
            $endsAt = Carbon::createFromTimestamp($subscriptionData->current_period_end);
        elseif ($subscriptionData->status === 'canceled'):
            // The subscription has completely expired or was terminated immediately
            $endsAt = now();
        endif;
        $currentPeriodEnd = Carbon::createFromTimestamp($subscriptionData->current_period_end);

        // Upsert localized relational subscription record mapping logic
        $subscription = Subscription::updateOrCreate(
            ['stripe_id' => $stripeSubscriptionId],
            [
                'user_id'       => $user->id,
                'plan_price_id' => $planPrice->id, // Normalized database integer ID link
                'type'          => $subscriptionData->metadata->type ?? 'default',
                'stripe_status' => $status,
                'stripe_price'  => $stripePriceId,
                'quantity'      => $quantity,
                'trial_ends_at' => $trialEndsAt,
                'ends_at'       => $endsAt,
                'current_period_end'       => $currentPeriodEnd,
            ]
        );

        // Synchronize nested subscription line items safely if passed
        if (isset($subscriptionData->items->data)) {
            foreach ($subscriptionData->items->data as $item) {
                SubscriptionItem::updateOrCreate(
                    ['stripe_id' => $item->id],
                    [
                        'subscription_id'  => $subscription->id, // Clean normalized internal link line
                        'stripe_product'   => $item->price->product ?? '',
                        'stripe_price'     => $item->price->id ?? '',
                        'quantity'         => $item->quantity ?? 1,
                        'meter_id'         => $item->meter ?? null,
                        'meter_event_name' => $item->meter_event_name ?? null,
                    ]
                );
            }
        }

        Log::info("🔄 Local database rows synced for user subscription ID: {$stripeSubscriptionId}. Status: {$status}");
        return true;
    }

    /**
     * Terminate or cancel local active subscription visibility records.
     */
    public function handleSubscriptionDeleted(object $subscriptionData): bool
    {
        $subscription = Subscription::where('stripe_id', $subscriptionData->id)->first();

        if ($subscription) {
            $subscription->update([
                'stripe_status' => 'canceled',
                'ends_at'       => Carbon::now(),
            ]);

            Log::info("🛑 Local subscription row marked canceled for Stripe Reference ID: {$subscriptionData->id}");
            return true;
        }

        return false;
    }

    public function handleInvoicePaymentSucceeded(object $invoiceData): bool
    {
        Log::info("📄 Processing successful invoice payment payload: ", ['payload'=> $invoiceData]);
        $stripeInvoiceId = $invoiceData->id;
        $stripeCustomerId = $invoiceData->customer;
        $stripePaymentMethodId = $invoiceData->payment_method ?? null;
        
        // 1. Locate the local user via their Stripe Customer ID
        $user = User::where('stripe_id', $stripeCustomerId)->first();
        if (!$user) {
            Log::error("Stripe Webhook Error [Invoice]: Local User match missing for Customer Reference: {$stripeCustomerId}");
            return false;
        }

        // 2. Approach A Step: Map Stripe Payment Method Token to local integer ID
        $localPaymentMethodId = null;
        if ($stripePaymentMethodId) {
            $paymentMethod = PaymentMethod::updateOrCreate(
                ['stripe_payment_method_id' => $stripePaymentMethodId],
                [
                    'user_id' => $user->id,
                    // 'card_brand' => 'visa', // Optional card layout parsing values
                    // 'last_four'  => '4242'
                ]
            );
            $localPaymentMethodId = $paymentMethod->id;
        }

        // 3. Approach A Step: Map the first Stripe Tax Rate Token to local integer ID
        $localTaxRateId = null;
        if (!empty($invoiceData->default_tax_rates)) {
            $stripeTaxRateId = $invoiceData->default_tax_rates[0];
            
            $taxRate = TaxRate::updateOrCreate(
                ['stripe_tax_rate_id' => $stripeTaxRateId],
                [
                    // Set default name placeholders if missing; Stripe's full webhook object 
                    // typically attaches 'tax_amounts' with objects containing explicit names
                    'name'       => 'VAT / Tax Rate', 
                    'percentage' => $invoiceData->tax_percent ?? 0
                ]
            );
            $localTaxRateId = $taxRate->id;
        }

        // 4. Create or Update the historical transaction record
        Invoice::updateOrCreate(
            ['stripe_invoice_id' => $stripeInvoiceId],
            [
                'user_id'            => $user->id,
                'subtotal'           => $invoiceData->subtotal,      // Stored in cents natively from Stripe
                'tax_amount'         => $invoiceData->tax ?? 0,      // Stored in cents natively from Stripe
                'total'              => $invoiceData->total,         // Stored in cents natively from Stripe
                'currency'           => strtoupper($invoiceData->currency),
                'status'             => $invoiceData->status,        // e.g., "paid"
                'payment_method_id'  => $localPaymentMethodId,       // Internal integer reference
                'tax_rate_id'        => $localTaxRateId,             // Internal integer reference
                'hosted_invoice_url' => $invoiceData->hosted_invoice_url, // Stripe-hosted receipt link
                'invoice_pdf'        => $invoiceData->invoice_pdf,        // PDF download link
            ]
        );

        Log::info("💵 Invoice successfully recorded locally for User ID {$user->id}. Invoice ID: {$stripeInvoiceId}");
        return true;
    }

    // get invoices by user id
    public function getUserInvoices(User $user)
    {
        return Invoice::where('user_id', $user->id)->orderBy('created_at', 'desc')->get();
    }

    public function isSubscribed(User $user): bool
    {
        $subscription = $user->subscriptions()
            ->whereIn('stripe_status', ['active', 'trialing', 'past_due'])
            ->latest()
            ->first();
        if(!$subscription) {
             return false;
        }

        // Check if user in grace period 
        if (!is_null($subscription->ends_at)) {
            // check if the grace period has not expired yet
            return $subscription->ends_at->isFuture();
        }
        // 3. Case B: Standard Active Lifecycle (Subscribed & Auto-renewing normally).
        // Verify current time is before 'current_period_end' + our 2-day safety bank buffer window.
        return $subscription->current_period_end->addDays(2)->isFuture();
    }
}