<?php

namespace App\Http\Controllers\Api\Workspace\Billing;

use App\Http\Controllers\Controller;
use App\Services\Workspace\Billing\CheckoutService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CheckoutController extends Controller
{
    public function __construct(
         protected CheckoutService $checkoutService
    )
    {
        // 
    }

    public function createSession(Request $request): JsonResponse
    {
        $request->validate([
            'plan_slug' => 'required|string',
        ]);
        $checkoutUrl = $this->checkoutService->createCheckoutSession(
            $request->user(), 
            $request->plan_slug
        );
        return response()->json(['url' => $checkoutUrl], 200);
    }
}