<?php

namespace App\Http\Controllers\Api\Billing;

use App\Http\Controllers\Controller;
use App\Services\Billing\BillingService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Exception;

class BillingPortalController extends Controller
{
    public function __construct(
        protected BillingService $billingService
    )
    {
        // 
    }

    public function createSession(Request $request): JsonResponse
    {
        try {
            $portalUrl = $this->billingService->createPortalSession($request->user());
            return response()->json(['url' => $portalUrl], 200);
        } catch (Exception $e) {
            $statusCode = $e->getCode() === 422 ? 422 : 500;
            return response()->json(['message' => $e->getMessage()], $statusCode);
        }
    }
}