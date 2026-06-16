<?php

namespace App\Services\Billing;

use App\Models\{User, Subscription, SubscriptionItem};
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SubscriptionService
{
    public function __construct() {
        // 
    }
    /**
     * Handle immediate subscription terminations or full expirations.
     */
    public function handleSubscriptionDeleted(object $stripeSubscription): void
    {
        $subscription = Subscription::where('stripe_id', $stripeSubscription->id)->first();

        if ($subscription) {
            $subscription->update([
                'stripe_status' => 'canceled',
                'ends_at'       => now(),
            ]);
            Log::info("🛑 Subscription permanently marked as canceled: {$stripeSubscription->id}");
        }
    }

    public function handleSubscriptionUpdated(object $subscriptionData): bool
    {
        $stripeSubscriptionId = $subscriptionData->id;
        $stripeCustomerId = $subscriptionData->customer;
        $stripePriceId = $subscriptionData->items->data[0]->price->id ?? null;
        $status = $subscriptionData->status;
        $quantity = $subscriptionData->items->data[0]->quantity ?? 1;

        // Log::info("🔄 Processing subscription update payload: ", ['payload'=> $subscriptionData]);
        $user = User::where('stripe_id', $stripeCustomerId)->first();
        if (!$user) {
            $userId = $subscriptionData->metadata->user_id ?? null;
            if($userId) {
                $user = User::find($userId);
                if ($user) {
                    $user->update(['stripe_id' => $stripeCustomerId]);
                }
            }
        }
        if(!$user) {
            return false;
        }
        $trialEndsAt = isset($subscriptionData->trial_end) ? Carbon::createFromTimestamp($subscriptionData->trial_end) : null;

        // 2. 🟢 Professional Grace Period & Expiration Parsing
        $endsAt = null;

        if ($subscriptionData->cancel_at_period_end):
            // The user canceled, but has prepaid access until the period finishes (Grace Period)
            $endsAt = Carbon::createFromTimestamp($subscriptionData->cancel_at_period_end);
        elseif ($subscriptionData->status === 'canceled'):
            // The subscription has completely expired or was terminated immediately
            $endsAt = now();
        endif;
        $currentPeriodEnd = isset($subscriptionData->current_period_end)
            ? Carbon::createFromTimestamp($subscriptionData->current_period_end)
            : now()->addMonth();

        // Upsert localized relational subscription record mapping logic
        $subscription = Subscription::updateOrCreate(
            ['stripe_id' => $stripeSubscriptionId],
            [
                'user_id'       => $user->id,
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

    public function upgradeSubscription(User $user, string $newPriceId)
    {
        $subscription = $user->subscriptions()->where('stripe_status', 'active')->first();
        if(!$subscription):
            throw new Exception("The selected subscription does not exist.", 422);
        endif;

        try {
            $subscription->swapAndInvoice($newPriceId);
        } catch (IncompletePayment $exception) {
            throw new Exception("Extra authentication required to complete the upgrade payment.", 422);
        } catch (\Exception $e) {
            throw new Exception("An error occurred during upgrade: " . $e->getMessage(), 500);
        }

    }
}