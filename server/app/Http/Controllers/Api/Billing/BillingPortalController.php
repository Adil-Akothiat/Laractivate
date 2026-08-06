<?php

namespace App\Http\Controllers\Api\Billing;

use App\Http\Controllers\Controller;
use App\Services\Billing\{ CheckoutService };
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Exception;
use Illuminate\Support\Facades\Log;

class BillingPortalController extends Controller
{
    public function __construct(
        protected CheckoutService $checkoutService
    )
    {
        // 
    }

    public function createSession(Request $request): JsonResponse
    {
        try {
            $portalUrl = $this->checkoutService->createPortalSession($request->user());
            return response()->json(['url' => $portalUrl], 200);
        } catch (Exception $e) {
            $statusCode = $e->getCode() === 422 ? 422 : 500;
            return response()->json(['message' => $e->getMessage()], $statusCode);
        }
    }

    public function initializePortal(Request $request) {
        $user = $request->user();
        $activeClockId = config('services.stripe.active_test_clock');
        // Log::info('ACTIVE CLOCK', ['ID'=> $activeClockId]);
        // 1. If they have a local Stripe ID, let's validate it against the live API
        if ($user->hasStripeId()) {
            try {
                \Stripe\Stripe::setApiKey(config('cashier.secret'));
                $stripeCustomer = $user->asStripeCustomer();

                // CRITICAL CHECK: If the customer exists but belongs to a dead clock, force a reset
                if (isset($stripeCustomer->test_clock) && $stripeCustomer->test_clock !== $activeClockId) {
                    throw new \Exception("Customer belongs to a mismatched test clock environment.");
                }
            } catch (\Exception $e) {
                // If Stripe throws "No such billingclock" or "No such customer", wipe local stale keys
                \Log::warning("Stale Stripe customer detected. Wiping local mapping and recreating: " . $e->getMessage());
                
                $user->update([
                    'stripe_id' => null,
                    'trial_ends_at' => null,
                ]);
                $user->refresh();
            }
        }

        // 2. Safe Provisioning: If they don't have an ID (or we just wiped an old one), create them fresh
        if (! $user->hasStripeId()) {
            $options = [];
            if ($activeClockId) {
                $options['test_clock'] = $activeClockId;
            }

            $user->createAsStripeCustomer($options);
            $user->refresh();
        }

        // 3. Check payment methods directly from Stripe's fresh SDK object
        $hasPaymentMethod = false;
        try {
            \Stripe\Stripe::setApiKey(config('cashier.secret'));
            $stripeCustomer = $user->asStripeCustomer();
            $hasPaymentMethod = !empty($stripeCustomer->invoice_settings->default_payment_method);
        } catch (\Exception $e) {
            \Log::error("Failed to fetch payment methods from Stripe: " . $e->getMessage());
        }

        // Return clean payload
        return response()->json([
            'stripe_id' => $user->stripe_id,
            'has_payment_method' => $hasPaymentMethod,
        ]);
    }
}