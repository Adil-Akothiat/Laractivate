<?php

namespace App\Services\Billing;

use App\Models\{User, Subscription, SubscriptionItem};
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Stripe\StripeClient;

class SubscriptionService
{
    protected $stripe;

    public function __construct()
    {
        $this->stripe = new StripeClient(config('cashier.secret') ?? env('STRIPE_API_KEY'));
    }

    public function upgrade(string $planSlug) {
        $planService = app(PlanService::class);
        $user = auth()->user();
        $currentSub = $this->getActiveSubscription($user);
        $stripeSub = $currentSub->asStripeSubscription();

        if(!empty($stripeSub->schedule)):
            try {
                $subscriptionSchedule = $this->stripe->subscriptionSchedules->retrieve($stripeSub->schedule);
                if ($subscriptionSchedule && $subscriptionSchedule->status !== 'released') 
                {
                    $this->stripe->subscriptionSchedules->release($stripeSub->schedule, [
                        'preserve_cancel_date' => false
                    ]);
                }
            } catch (\Exception $e) {
                throw new \Exception("Failed to release subscription schedule: " . $e->getMessage(), 500);
            }
        endif;

        $targetPlan = $planService->getPlan($planSlug ?? '');
        $newPriceId = $targetPlan['price_id'];
        if(!$newPriceId) {
            throw new \Exception("Invalid plan slug: " . $planSlug, 422);
        }
        
        try {
            $currentSub->swapAndInvoice($newPriceId);
        } catch (IncompletePayment $exception) {
            throw new \Exception("Extra authentication required to complete the upgrade payment.", 422);
        } catch (\Exception $e) {
            throw new \Exception("An error occurred during upgrade: " . $e->getMessage(), 500);
        }
    }

    public function downgrade(string $planSlug) {
        $user = auth()->user();
        $planService = app(PlanService::class);
        
        $subscription = $this->getActiveSubscription($user);
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

            return [
                'response'=> [],
                'message'=> "Your subscription downgrade is already scheduled to take effect on {$formattedDate}.",
                'status_code'=> 422
            ];
        }

        // Log::info('SUBSCRIPTION', ['SUB'=> $stripeSubscription]);
        $subscriptionSchedule = $this->stripe->subscriptionSchedules->create([
            'from_subscription' => $stripeSubscription->id,
        ]);
        $targetPlan = $planService->getPlan($planSlug ?? '');

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
        return [
            'response'=> [],
            'message'=> "Your plan downgrade to {$targetPlan['name']} has been successfully scheduled.",
            'status_code'=> 200
        ];
    }

    public function cancel(): array
    {
        $user = auth()->user();
        $subscription = $this->getActiveSubscription($user, false);
        if (!$subscription) {
            return [
                'response' => [],
                'message' => "No active subscription found.",
                'status_code' => 404
            ];
        }
        
        if ($subscription->onGracePeriod()) {
            return [
                'response' => [],
                'message' => "Your subscription is already set to cancel at the end of the current billing period.",
                'status_code' => 422
            ];
        }
        

        $stripeSub = $subscription->asStripeSubscription();
        if(!empty($stripeSub->schedule)) {
            $this->stripe->subscriptionSchedules->cancel($stripeSub->schedule);
            $subscription->update([
                'ends_at' => \Carbon\Carbon::createFromTimestamp($stripeSub->current_period_end),
                'stripe_status' => 'active' // Keep status active until current_period_end passes
            ]);

            return [
                'response' => [],
                'message' => "Your scheduled changes were dropped, and your subscription has been canceled.",
                'status_code' => 200
            ];
        }

        $subscription->cancel();
        return [
            'response'=> [],
            'message'=> "Your subscription has been canceled and will remain active until the end of the current billing period.",
            'status_code'=> 200
        ];
    }

    public function scheduledCancel() {
        $user = auth()->user();
        $subscription = $this->getActiveSubscription($user);

        if(!$subscription) {
            return [
                'response'=> [],
                'message'=> "You do not have an active subscription.",
                'status_code'=> 404
            ];
        }

        $stripeSubscription = $subscription->asStripeSubscription();
        if(empty($stripeSubscription->schedule)) {
            return [
                'response'=> [],
                'message'=> "You do not have a scheduled subscription.",
                'status_code'=> 404
            ];
        }

        $this->stripe->subscriptionSchedules->release($stripeSubscription->schedule);
        return [
            'response'=> [],
            'message'=> "Your scheduled subscription has been canceled.",
            'status_code'=> 200
        ];
        
    }

    public function hardCancel() {
        $user = auth()->user();
        $subscription = $this->getActiveSubscription($user);

        if(!$subscription) {
            return [
                'response'=> [],
                'message'=> "You do not have an active subscription.",
                'status_code'=> 404
            ];
        }
        $stripeSubscription = $subscription->asStripeSubscription();

        if($stripeSubscription->cancel_at_period_end) {
            return [
                'response'=> [],
                'message'=> "Your subscription is already set to cancel at the end of the current billing period.",
                'status_code'=> 422
            ];
        }
        $this->stripe->subscriptions->cancel($stripeSubscription->id);
        return [
            'response'=> [],
            'message'=> "Your subscription has been canceled and will remain active until the end of the current billing period.",
            'status_code'=> 200
        ];
    }

    public function resume() {
        $user = auth()->user();
        $subscription = $this->getActiveSubscription($user, false);
        if(!$subscription || !$subscription->onGracePeriod()) {
            return [
                'response' => [],
                'message' => "This subscription cannot be resumed.",
                'status_code' => 422
            ];
        }
        $subscription->resume();
        return [
            'response'=> [],
            'message'=> "Your subscription has been resumed and will continue to be active.",
            'status_code'=> 200
        ];
    }

    /**
     * Handle immediate subscription terminations or full expirations.
    */

    public function handleSubscriptionUpdated(object $subscriptionData): bool
    {
        $stripeSubscriptionId = $subscriptionData->id;
        $stripeCustomerId = $subscriptionData->customer;
    
        // 1. Locate the user safely
        $user = User::where('stripe_id', $stripeCustomerId)->first() 
            ?? User::find($subscriptionData->metadata->user_id ?? null);
    
        if (!$user) {
            return false;
        }
    
        // Link stripe_id dynamically if it was missing
        if (!$user->stripe_id) {
            $user->update(['stripe_id' => $stripeCustomerId]);
        }
    
        // 2. Fetch the core subscription row that Cashier already created/updated
        $subscription = $user->subscriptions()->where('stripe_id', $stripeSubscriptionId)->first();
    
        if (!$subscription) {
            return false;
        }
    
        // 3. Keep the local row enriched with your premium boilerplate metadata
        $subscription->update([
            'type'               => $subscriptionData->metadata->type ?? $subscription->type ?? 'default',
            'current_period_end' => isset($subscriptionData->current_period_end) 
                ? Carbon::createFromTimestamp($subscriptionData->current_period_end) 
                : $subscription->current_period_end,
        ]);
    
        // 4. Synchronize nested relational subscription line items (Usage/Multi-price support)
        if (!empty($subscriptionData->items->data)) {
            foreach ($subscriptionData->items->data as $item) {
                SubscriptionItem::updateOrCreate(
                    ['stripe_id' => $item->id],
                    [
                        'subscription_id'  => $subscription->id,
                        'stripe_product'   => $item->price->product ?? '',
                        'stripe_price'     => $item->price->id ?? '',
                        'quantity'         => $item->quantity ?? 1,
                        'meter_id'         => $item->meter ?? null,
                        'meter_event_name' => $item->meter_event_name ?? null,
                    ]
                );
            }
        }
    
        Log::info("🔄 Relational billing items synced for subscription ID: {$stripeSubscriptionId}");
        return true;
    }

    public function getUserSubscriptions(User $user, array $filters = [])
    {
        // Extract common query params with default fallbacks
        $perPage = $filters['per_page'] ?? 10;
        $orderBy = $filters['order_by'] ?? 'created_at';
        $sort    = $filters['sort'] ?? 'desc';

        // 🟢 Using the $user relationship ensures strict contextual scope separation automatically
        return $user->subscriptions()
            // 🔍 Filter 1: Optional search query (matches against plan names or Stripe Reference Tokens)
            ->when(!empty($filters['query']), function ($query) use ($filters) {
                $query->where(function ($subQuery) use ($filters) {
                    $subQuery->where('name', 'LIKE', "%{$filters['query']}%") // 'name' holds the plan slug (e.g., 'pro')
                            ->orWhere('stripe_id', 'LIKE', "%{$filters['query']}%")
                            ->orWhere('stripe_status', 'LIKE', "%{$filters['query']}%");
                });
            })
            // 🏷️ Filter 2: Direct match for Stripe lifecycle states (e.g., 'active', 'trialing', 'canceled')
            ->when(!empty($filters['status']), function ($query) use ($filters) {
                $query->where('stripe_status', $filters['status']);
            })
            // 📊 Sorting Layer
            ->orderBy($orderBy, $sort)
            // 🟢 Paginate auto-handles the 'page' parameter passed by the client
            ->paginate($perPage)
            // This appends the dynamic parameters to the generated pagination links layout
            ->appends($filters);
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

    public function getActiveSubscription(User $user, bool $withException = true)
    {
        $subscription = $user->subscriptions()->where('stripe_status', 'active')->first();
        if(!$subscription && $withException):
            throw new \Exception("The selected subscription does not exist.", 422);
        endif;
        return $subscription;
    }
}