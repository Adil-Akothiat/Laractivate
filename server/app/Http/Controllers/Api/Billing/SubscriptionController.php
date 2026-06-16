<?php

namespace App\Http\Controllers\Api\Billing;

use App\Http\Controllers\Controller;
use App\Services\Billing\{PlanService, InvoiceService, SubscriptionService};
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

    public function upgrade(Request $request): JsonResponse
    {
        $request->validate([
            'plan_slug'=> 'required|string'
        ]);
        
        $targetPlan = (new PlanService())->getPlan($request->plan_slug ?? '');
        if(!$targetPlan):
            return (new BaseResource([]))->withMessage('Invalid target plan.')->response()->setStatusCode(422);
        endif;

        $newPriceId = $targetPlan['price_id'];
        $user = auth()->user();
        (new SubscriptionService())->upgradeSubscription($user, $newPriceId);
        return (new BaseResource([]))->withMessage('Subscription upgraded successfully!')->response()->setStatusCode(200);
    }

    public function previewUpgrade(Request $request): JsonResponse
    {
        $request->validate([
            'plan_slug' => 'required|string',
        ]);

        $user = $request->user();
        $targetPlan = (new PlanService())->getPlan($request->plan_slug ?? '');

        if (!$targetPlan) {
            return (new BaseResource([]))->withMessage('Invalid target plan.')->response()->setStatusCode(422);
        }

        $proration = (new InvoiceService())->previewProration($user, $targetPlan['price_id'] ?? '');
        return (new BaseResource($proration))->response()->setStatusCode(200); 
    }
}