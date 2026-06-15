<?php

namespace App\Http\Controllers\Api\Billing;

use App\Http\Controllers\Controller;
use App\Services\Billing\{PlanService, InvoiceService};
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Resources\System\BaseResource;
use Stripe\StripeClient;
use Illuminate\Support\Facades\Log;

class SubscriptionController extends Controller
{
    private $stripe;
    public function __construct() {
        $this->stripe = new StripeClient(config('cashier.secret') ?? env('STRIPE_SECRET'));
    }

    /**
     * Get the authenticated user's active subscription details.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Fetch the active subscription from the database relation
        $subscription = $user->subscriptions()
            ->whereIn('stripe_status', ['active', 'trialing', 'past_due'])
            ->latest()
            ->first();

        if (!$subscription) {
            return response()->json([
                'subscribed' => false,
                'plan' => null
            ], 200);
        }

        // Cross-reference with our local configuration to get metadata like friendly names or features
        $planConfig = config("billing.plans.{$subscription->name}");

        return response()->json([
            'subscribed' => $this->billingService->isSubscribed($user),
            'subscription_id' => $subscription->stripe_id,
            'status' => $subscription->stripe_status,
            'plan' => [
                'name' => $planConfig['name'] ?? ucfirst($subscription->name),
                'slug' => $subscription->name,
                'price' => $planConfig['price'] ?? 0,
                'currency' => $planConfig['currency'] ?? 'usd',
                'interval' => $planConfig['interval'] ?? 'month',
            ],
            'renews_at' => $subscription->current_period_end ? $subscription->current_period_end->toIso8601String() : null,
            'ends_at' => $subscription->ends_at ? $subscription->ends_at->toIso8601String() : null,
            'on_grace_period' => !is_null($subscription->ends_at) && $subscription->ends_at->isFuture(),
        ], 200);
    }

    public function upgrade() {
        // 1. Validate that the target plan slug has been requested
        $request->validate([
            'plan_slug' => 'required|string',
        ]);

        $user = $request->user() ?? auth()->user();
        $newPlanSlug = strtolower($request->plan_slug);

        // 2. Locate the plan settings dynamically from your boilerplate configuration file
        $plans = config('billing.plans');
        $targetPlan = collect($plans)->firstWhere('slug', $newPlanSlug);

        if (!$targetPlan || empty($targetPlan['stripe_price_id'])) {
            (new BaseResource([]))->withMessage('The target configuration contains an invalid or missing Stripe Price ID mapping.')->response()->setStatusCode(422);
        }

        // 3. Locate the user's active local subscription record
        $localSubscription = $user->subscriptions()->where('stripe_status', 'active')->first();
        
        if (!$localSubscription) {
            (new BaseResource([]))->withMessage('No active billing structure found to switch from. Use checkout session instead.')->response()->setStatusCode(400);
        }

        // 4. Prevent updating if they are requesting the exact same plan tier
        if (strtolower($localSubscription->name) === $newPlanSlug) {
            (new BaseResource([]))->withMessage('You are already registered on this plan.')->response()->setStatusCode(422);
        }

        try {
            Log::info("🔄 [SubscriptionController] Processing plan switch request", [
                'user_id' => $user->id,
                'from_slug' => $localSubscription->name,
                'to_slug' => $newPlanSlug
            ]);

            // 5. Retrieve the subscription object directly from Stripe to locate its Item ID reference
            $stripeSubscription = $this->stripe->subscriptions->retrieve($localSubscription->stripe_id);
            $subscriptionItemId = $stripeSubscription->items->data[0]->id;

            // 6. Tell Stripe to change the plan immediately while enforcing proration calculations
            $updatedSubscription = $this->stripe->subscriptions->update($localSubscription->stripe_id, [
                'items' => [
                    [
                        'id' => $subscriptionItemId,
                        'price' => $targetPlan['stripe_price_id'],
                    ],
                ],
                'proration_behavior' => 'create_prorations', // 👈 Applies the unused day-one credit immediately!
                'payment_behavior'   => 'pending_if_incomplete',
            ]);

            // 7. Synchronize changes to your local database records
            $localSubscription->update([
                'name'         => $newPlanSlug,
                'stripe_price' => $targetPlan['stripe_price_id']
            ]);

            Log::info("💵 Plan successfully switched in Stripe and local DB.", ['user_id' => $user->id]);

            return response()->json([
                'success' => true,
                'message' => "Successfully shifted your subscription plan to {$targetPlan['name']}!",
                'subscription' => $updatedSubscription
            ], 200);

            return (new BaseResource(['subscription' => $updatedSubscription]))->withMessage("Successfully shifted your subscription plan to {$targetPlan['name']}!")->response()->setStatusCode(422);
            

        } catch (\Exception $e) {
            Log::error("❌ Plan upgrade/downgrade failed", ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Failed processing Stripe subscription changes.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function previewUpgrade(Request $request): JsonResponse
    {
        $request->validate([
            'plan_slug' => 'required|string',
        ]);

        $user = $request->user();
        $targetPlan = (new PlanService())->getPlan($request->plan_slug ?? '');

        if (!$targetPlan || empty($targetPlan['price_id'])) {
            return (new BaseResource([]))->withMessage('Invalid target plan.')->response()->setStatusCode(422);
        }

        $proration = (new InvoiceService())->previewProration($user, $targetPlan['price_id'] ?? '');
        return (new BaseResource($proration))->response()->setStatusCode(200); 
    }
}