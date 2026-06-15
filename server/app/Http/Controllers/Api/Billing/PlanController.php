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

        Log::info('User accessing internal plans schema grid', ['user_id' => $user->id]);

        // Find the user's active local subscription tier
        $activeSub = $user->subscriptions()->where('stripe_status', 'active')->first();
        Log::info('ACTIVE SUBSCRIPTION', ['acsub'=> $activeSub]);
        $currentPlanSlug = $activeSub ? strtolower($activeSub->type) : null;

        $mappedPlans = collect($plans)->map(function ($plan) use ($currentPlanSlug) {
            $slug = strtolower($plan['slug']);
            return [
                'slug'        => $slug,
                'name'        => $plan['name'] ?? ucfirst($plan['slug']),
                'description' => $plan['description'] ?? '',
                'price'       => $plan['price'] ?? 0,
                'currency'    => $plan['currency'] ?? 'usd',
                'interval'    => $plan['interval'] ?? 'month',
                'features'    => $plan['features'] ?? [],
                // Structural helper context switches for React component styling
                'is_current'  => ($currentPlanSlug === $slug),
            ];
        })->values();

        return (new BaseResource([
            'plans'=> $mappedPlans,
             'meta'  => [
                'has_active_subscription' => !empty($activeSub),
                'current_plan_slug'       => $currentPlanSlug,
            ]
        ]))->response()->setStatusCode(200);
    }
}