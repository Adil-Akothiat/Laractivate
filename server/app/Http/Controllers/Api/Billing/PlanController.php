<?php

namespace App\Http\Controllers\Api\Billing;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\System\BaseResource;

class PlanController extends Controller
{
    /**
     * Public Route: Fetch plans for marketing/landing pages before authentication.
     */
    public function index(): JsonResponse
    {
        $plans = config('billing.plans');

        if (empty($plans)) {
            return response()->json(['message' => 'Billing tiers configuration file missing.'], 500);
        }

        // Return clean, public-facing data structures
        $sanitizedPlans = collect($plans)->map(function ($plan) {
            return [
                'slug'        => $plan['slug'],
                'name'        => $plan['name'] ?? ucfirst($plan['slug']),
                'description' => $plan['description'] ?? '',
                'price'       => $plan['price'] ?? 0,
                'currency'    => $plan['currency'] ?? 'usd',
                'interval'    => $plan['interval'] ?? 'month',
                'features'    => $plan['features'] ?? [],
            ];
        })->values();
        return (new BaseResource($sanitizedPlans))->response()->setStatusCode(200);
    }

    /**
     * Protected Route: Fetch billing plans inside the workspace dashboard context.
     */
    public function userPricing(): JsonResponse
    {
        $user = auth()->user();
        $plans = config('billing.plans');

        if (empty($plans)) {
            return response()->json(['message' => 'Billing tiers configuration file missing.'], 500);
        }

        // 1. Get the active subscription
        $activeSub = $user->subscriptions()->where('stripe_status', 'active')->first();
        
        // 2. Fetch the actual active Stripe Price ID from Cashier's relation
        // Cashier loads the active item via the items relationship out-of-the-box
        $currentStripePrice = $activeSub ? $activeSub->stripe_price : null;

        $mappedPlans = collect($plans)->map(function ($plan) use ($currentStripePrice) {
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

        return BaseResource::make([
            'plans' => $mappedPlans,
            'meta'  => [
                'has_active_subscription' => !empty($activeSub),
                'current_plan_slug'       => $currentPlanSlug,
            ]
        ])->response()->setStatusCode(200);
    }
}