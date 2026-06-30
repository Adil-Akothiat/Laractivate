<?php

namespace App\Services\Billing;

use App\Models\User;
use Stripe\Event;

class PlanService
{
    private $plans;
    public function __construct(
        protected SubscriptionService $subscriptionService
    ){
        $this->plans = config('billing.plans');
        if(empty($this->plans)):
            throw new \Exception("Billing tiers configuration file missing.", 422);
        endif;
    }

    public function sanitizedPlans():Array
    {
        return collect($this->plans)->map(function ($plan) {
            return [
                'slug'        => $plan['slug'],
                'name'        => $plan['name'] ?? ucfirst($plan['slug']),
                'description' => $plan['description'] ?? '',
                'price'       => $plan['price'] ?? 0,
                'currency'    => $plan['currency'] ?? 'usd',
                'interval'    => $plan['interval'] ?? 'month',
                'features'    => $plan['features'] ?? [],
            ];
        })->values() ?? [];
    }   
    
    public function getPlan(string $slug, bool $withException = true): Array
    {
        $targetPlan = collect($this->plans)->firstWhere('slug', $slug);
        if(!$targetPlan && $withException):
            throw new \Exception("Invalid plan tier selected.", 422);
        endif;
        return $targetPlan;
    }

    public function getActivePlan(User $user) {
        $subscription = $this->subscriptionService->getActiveSubscription($user);
        $stripPriceId = $subscription->stripe_price;
        $activePlan = collect($this->plans)->firstWhere('price_id', $subscription->stripe_price);
        return $activePlan;
    }

    public function getUserPlans():Array 
    {
        $user = auth()->user();
        $user->subscriptions->each(function ($subscription) {
            $subscription->syncStripeStatus();
        });

        // Refresh your user model instance data & relationships
        $user->refresh();

        // 1. Get the active subscription
        $activeSub = $this->subscriptionService->getActiveSubscription($user, false);
        // Log::info('SUBSCRIPTION', ['SUB'=> $activeSub?->asStripeSubscription()]);
        
        // 2. Fetch the actual active Stripe Price ID from Cashier's relation
        // Cashier loads the active item via the items relationship out-of-the-box
        $currentStripePrice = $activeSub ? $activeSub->stripe_price : null;

        $mappedPlans = collect($this->plans)->map(function ($plan) use ($currentStripePrice) {
            return [
                'slug'        => strtolower($plan['slug']),
                'name'        => $plan['name'] ?? ucfirst($plan['slug']),
                'description' => $plan['description'] ?? '',
                'price'       => $plan['price'] ?? 0,
                'currency'    => $plan['currency'] ?? 'usd',
                'interval'    => $plan['interval'] ?? 'month',
                'features'    => $plan['features'] ?? [],
                // 3. Match against the unique Price ID instead of the type column
                'is_current'  => ($currentStripePrice === $plan['price_id']),
            ];
        })->values();

        // Determine current slug for meta block based on what matched
        $currentPlan = collect($mappedPlans)->firstWhere('is_current', true);
        $currentPlanSlug = $currentPlan ? $currentPlan['slug'] : null;

        return [
            'plans' => $mappedPlans,
            'meta'  => [
                'has_active_subscription' => !empty($activeSub),
                'current_plan_slug'       => $currentPlanSlug,
            ]
        ];
    }
}