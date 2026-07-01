<?php

namespace App\Services\Billing;

use App\Models\User;
use Illuminate\Support\Facades\Log;
use Exception;
use Stripe\Checkout\Session as StripeSession;
use Stripe\Stripe;

class CheckoutService
{
    public function __construct() {
        // write your constant initialization code here if needed
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
        $userId = $session->client_reference_id;
        $stripeCustomerId = $session->customer;
        $stripeSubscriptionId = $session->subscription;
   
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

        Log::info("🚀 User ID {$userId} successfully completed subscription checkout.");
        return true;
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
        
        $checkout = $user->newSubscription($slug, $stripePriceId)
            ->checkout([
                'payment_method_types' => ['card'],
                'success_url' => config('services.client.url') . '/dashboard/pricing?session_id={CHECKOUT_SESSION_ID}&status=success',
                'cancel_url'  => config('services.client.url') . '/dashboard/pricing?status=cancelled',
        ]);
        return $checkout->url;
    }
}