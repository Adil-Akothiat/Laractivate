<?php

namespace App\Http\Controllers\Api\Billing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CheckoutController extends Controller
{
    public function createSession(Request $request): JsonResponse
    {
        // 1. Validate the incoming payload
        $request->validate([
            'plan_slug' => 'required|string',
        ]);

        // 2. Fetch plan details from config/billing.php
        $plan = config("billing.plans.{$request->plan_slug}");

        if (!$plan) {
            return response()->json(['message' => 'Selected plan layout not found.'], 422); // Fixed typo from 442 to 422
        }

        try {
            // Fetch the external client URL from configuration settings
            $clientUrl = config('services.client.url');

            // 3. Ask Cashier to build the Stripe checkout checkout url
            $checkout = $request->user()
                ->newSubscription($plan['slug'], $plan['price_id'])
                ->checkout([
                    // Redirect directly back to the React Vite frontend framework stack!
                    'success_url' => $clientUrl . '/dashboard/billing?success=true',
                    'cancel_url'  => $clientUrl . '/dashboard/billing?cancelled=true',
                    
                    // CRITICAL: Connects this checkout checkout journey directly to this user model ID for the Webhook handler!
                    'client_reference_id' => $request->user()->id,
                ]);

            return response()->json([
                'url' => $checkout->url,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Stripe Session Error: ' . $e->getMessage()
            ], 500);
        }
    }
}