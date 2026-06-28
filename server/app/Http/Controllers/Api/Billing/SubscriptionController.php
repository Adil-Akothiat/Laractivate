<?php

namespace App\Http\Controllers\Api\Billing;

use App\Http\Controllers\Controller;
use App\Services\Billing\{PlanService, InvoiceService, SubscriptionService};
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Resources\System\BaseResource;
use Stripe\{StripeClient, SubscriptionSchedule, Stripe, Subscription};
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    private $stripe;
    public function __construct(
        protected PlanService $planService,
        protected SubscriptionService $subscriptionService,
        protected InvoiceService $invoiceService
    ) {
        $this->stripe = new StripeClient(config('cashier.secret') ?? env('STRIPE_SECRET'));
    }

    /**
     * Get the authenticated user's active subscription details.
     */
    // public function show(Request $request): JsonResponse
    // {
    //     $user = $request->user();
        
    //     // Fetch the active subscription from the database relation
    //     $subscription = $user->subscriptions()
    //         ->whereIn('stripe_status', ['active', 'trialing', 'past_due'])
    //         ->latest()
    //         ->first();

    //     if (!$subscription) {
    //         return response()->json([
    //             'subscribed' => false,
    //             'plan' => null
    //         ], 200);
    //     }
    //     // Cross-reference with our local configuration to get metadata like friendly names or features
    //     $planConfig = config("billing.plans.{$subscription->name}");

    //     return response()->json([
    //         'subscribed' => $this->billingService->isSubscribed($user),
    //         'subscription_id' => $subscription->stripe_id,
    //         'status' => $subscription->stripe_status,
    //         'plan' => [
    //             'name' => $planConfig['name'] ?? ucfirst($subscription->name),
    //             'slug' => $subscription->name,
    //             'price' => $planConfig['price'] ?? 0,
    //             'currency' => $planConfig['currency'] ?? 'usd',
    //             'interval' => $planConfig['interval'] ?? 'month',
    //         ],
    //         'renews_at' => $subscription->current_period_end ? $subscription->current_period_end->toIso8601String() : null,
    //         'ends_at' => $subscription->ends_at ? $subscription->ends_at->toIso8601String() : null,
    //         'on_grace_period' => !is_null($subscription->ends_at) && $subscription->ends_at->isFuture(),
    //     ], 200);
    // }

    public function upgrade(Request $request): JsonResponse
    {
        $request->validate([
            'plan_slug'=> 'required|string'
        ]);
        
        $targetPlan = $this->planService->getPlan($request->plan_slug ?? '');
        $newPriceId = $targetPlan['price_id'];
        $user = auth()->user();
        $this->subscriptionService->upgradeSubscription($user, $newPriceId);
        return (new BaseResource([]))->withMessage('Subscription upgraded successfully!')->response()->setStatusCode(200);
    }

    public function previewProration(Request $request): JsonResponse
    {
        $request->validate([
            'plan_slug' => 'required|string',
        ]);

        $user = $request->user();
        $targetPlan = $this->planService->getPlan($request->plan_slug ?? '');
        
        $currentPlan = $this->planService->getActivePlan($user);
        if ($currentPlan && $targetPlan['price_id'] === $currentPlan['price_id']) {
            return (new BaseResource([]))->withMessage('You are already on this plan.')->response()->setStatusCode(422);
        }

        // ==========================================
        // 1. DOWNGRADE GUARD & PREVIEW SCHEDULE
        // ==========================================
        if ($targetPlan['price'] < $currentPlan['price']) {
            $subscription = $this->subscriptionService->getActiveSubscription($user);
            // Grab the period end timestamp from your DB subscription record
            $periodEnd = $subscription->ends_at ?? now()->addMonth(); 

            return (new BaseResource([
                'action_type' => 'downgrade',
                'proration' => null,
                'downgradePrevent' => [
                    'amount_due_today' => 0,
                    'next_billing_amount' => $targetPlan['price'],
                    'effective_date' => $periodEnd->toIso8601String(),
                    'message' => "You will keep your {$currentPlan['name']} features until the end of your billing cycle. Your plan will automatically switch to {$targetPlan['name']} on renewal."
                ]
            ]
            ))->response()->setStatusCode(200);
        }

        $proration = $this->invoiceService->previewProration($user, $targetPlan['price_id'] ?? '');
        return (new BaseResource([
            'action_type'=> 'upgrade',
            'proration'=> $proration,
            'downgradePrevent'=> null
        ]))->response()->setStatusCode(200); 
    }

    public function downgrade(Request $request) {
        $request->validate([
            'plan_slug' => 'required|string',
        ]);

        $user = auth()->user();
        $subscription = $this->subscriptionService->getActiveSubscription($user);
        $stripeSubscription = $subscription->asStripeSubscription();
        
        $scheduleId = $stripeSubscription->schedule;
        if ($scheduleId) {
            // If it already has a schedule attached, you can safely retrieve it using the real schedule ID
            $subscriptionSchedule = $this->stripe->subscriptionSchedules->retrieve($scheduleId);
            $currentPhase = collect($subscriptionSchedule->phases)->first(function ($phase) {
                return time() >= $phase->start_date && time() <= $phase->end_date;
            });
            $endDateTimestamp = $currentPhase ? $currentPhase->end_date : $subscriptionSchedule->phases[0]->end_date;

            // 2. Format the timestamp with Carbon for your message string
            $formattedDate = Carbon::createFromTimestamp($endDateTimestamp)->toFormattedDateString();

            return (new BaseResource([]))
                ->withMessage("Your subscription downgrade is already scheduled to take effect on {$formattedDate}.")
                ->response()
                ->setStatusCode(422);
        }

        // Log::info('SUBSCRIPTION', ['SUB'=> $stripeSubscription]);
        $subscriptionSchedule = $this->stripe->subscriptionSchedules->create([
            'from_subscription' => $stripeSubscription->id,
        ]);
        $targetPlan = $this->planService->getPlan($request->plan_slug);

        $items = $stripeSubscription->items;
        $sub_start_date = $items->data[0]->current_period_start;
        $sub_end_date = $items->data[0]->current_period_end;
        $priceId = $items->data[0]->price->id;
        $quantity = $items->data[0]->quantity;

        $this->stripe->subscriptionSchedules->update($subscriptionSchedule->id, [
            'end_behavior'=> 'release',
            'phases'=> [
                [
                    'start_date'=> $sub_start_date,
                    'end_date'=> $sub_end_date,
                    'proration_behavior'=> 'none',
                    'items'=> [
                        ['price'=> $priceId,
                        'quantity'=> $quantity]
                    ]
                ],
                [
                    'start_date'=> $sub_end_date,
                    'end_date'=> Carbon::createFromTimestamp($sub_end_date)->addMonth()->timestamp,
                    'proration_behavior'=> 'none',
                    'items'=> [
                        ['price' => $targetPlan['price_id'],
                        'quantity' => $quantity,]
                    ]
                ],
            ]
        ]);

        return (new BaseResource([]))
        ->withMessage("Your plan downgrade to Pro has been successfully scheduled.")
        ->response()
        ->setStatusCode(200);
    }
}