<?php

namespace App\Http\Controllers\Api\Billing;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\System\BaseResource;
use App\Services\Billing\{SubscriptionService, PlanService};
use Illuminate\Support\Collection;

class PlanController extends Controller
{
    public function __construct(
        protected SubscriptionService $subscriptionService,
        protected PlanService $planService,
    ) {
    }
    /**
     * Public Route: Fetch plans for marketing/landing pages before authentication.
     */
    public function index(): JsonResponse
    {
        // Return clean, public-facing data structures
        try {
            $sanitizedPlans = $this->planService->sanitizedPlans();
            return (new BaseResource($sanitizedPlans))->response()->setStatusCode(200);
        } catch(\Exception $e) {
            return  response()->json(['e'=> $e->getMessage()], 550);
        }
    }

    /**
     * Protected Route: Fetch billing plans inside the workspace dashboard context.
     */
    public function userPricing(): JsonResponse
    {
        $userPlans = $this->planService->getUserPlans();
        return (new BaseResource($userPlans))->response()->setStatusCode(200);
    }
}