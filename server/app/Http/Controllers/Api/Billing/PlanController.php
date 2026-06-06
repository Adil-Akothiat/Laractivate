<?php

namespace App\Http\Controllers\Api\Billing;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class PlanController extends Controller
{
    /**
     * Pull the local dynamic plan matrices configuration array mapping
    */
    public function index(): JsonResponse
    {
        $plans = config('billing.plans');

        if (empty($plans)) {
            return response()->json(['message' => 'Billing tiers configuration file missing.'], 500);
        }

        // Map and sanitize layout elements to exclude internal webhook secret maps if present
        $sanitizedPlans = collect($plans)->map(function ($plan) {
            return [
                'slug'        => $plan['slug'],
                'name'        => $plan['name'] ?? ucfirst($plan['slug']),
                'description' => $plan['description'] ?? '',
                'price'       => $plan['price'] ?? 0,
                'currency'    => $plan['currency'] ?? 'usd',
                'features'    => $plan['features'] ?? [],
            ];
        })->values();

        return response()->json($sanitizedPlans, 200);
    }
}