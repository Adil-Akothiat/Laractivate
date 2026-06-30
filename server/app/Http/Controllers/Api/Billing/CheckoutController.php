<?php

namespace App\Http\Controllers\Api\Billing;

use App\Http\Controllers\Controller;
use App\Services\Billing\BillingService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Exception;

class CheckoutController extends Controller
{
    public function __construct(
         protected BillingService $billingService
    )
    {
        // 
    }

    public function createSession(Request $request): JsonResponse
    {
        $request->validate([
            'plan_slug' => 'required|string',
        ]);

        try {
            $checkoutUrl = $this->billingService->createCheckoutSession(
                $request->user(), 
                $request->plan_slug
            );

            return response()->json(['url' => $checkoutUrl], 200);

        } catch (Exception $e) {
            $statusCode = $e->getCode() === 422 ? 422 : 500;
            return response()->json(['message' => $e->getMessage()], $statusCode);
        }
    }
}