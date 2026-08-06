<?php

namespace App\Http\Controllers\Api\Billing;

use App\Http\Controllers\Controller;
use App\Services\Billing\{PlanService, InvoiceService, SubscriptionService};
use Illuminate\Http\JsonResponse;
use App\Http\Resources\System\BaseResource;
use App\Http\Resources\Billing\SubscriptionResource;
use Illuminate\Http\Request;
use Stripe\StripeClient;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    private $stripe;
    public function __construct(
        protected PlanService $planService,
        protected SubscriptionService $subscriptionService,
        protected InvoiceService $invoiceService
    ) {
        $this->stripe = new StripeClient(config('cashier.secret'));
    }

    public function upgrade(Request $request): JsonResponse
    {
        $request->validate([
            'plan_slug'=> 'required|string'
        ]);

        $this->subscriptionService->upgrade($request->plan_slug);
        return (new BaseResource([]))->withMessage('Subscription upgraded successfully!')->response()->setStatusCode(200);
    }

    public function previewProration(Request $request): JsonResponse
    {
        $request->validate([
            'plan_slug' => 'required|string',
        ]);

        $previewProrationResponse = $this->invoiceService->previewProration($request->plan_slug);
        $response = $previewProrationResponse['response'] ?? [];
        $statusCode = $previewProrationResponse['status_code'] ?? 200;
        return (new BaseResource($response))->response()->setStatusCode($statusCode); 
    }

    public function downgrade(Request $request): JsonResponse
    {
        $request->validate([
            'plan_slug' => 'required|string',
        ]);

        $downgradeResponse = $this->subscriptionService->downgrade($request->plan_slug);
        $response = $downgradeResponse['response'] ?? [];
        $statusCode = $downgradeResponse['status_code'] ?? 200;
        $message = $downgradeResponse['message'] ?? '';

        return (new BaseResource($response))
        ->withMessage($message)
        ->response()
        ->setStatusCode($statusCode);
    }

    public function cancel(Request $request): JsonResponse
    {
        $cancelResponse = $this->subscriptionService->cancel();
        $response = $cancelResponse['response'] ?? [];
        $statusCode = $cancelResponse['status_code'] ?? 200;
        $message = $cancelResponse['message'] ?? '';
    
        return (new BaseResource($response))
            ->withMessage($message)
            ->response()
            ->setStatusCode($statusCode);
    }

    public function scheduledCancel(Request $request): JsonResponse
    {
        $cancelResponse = $this->subscriptionService->scheduledCancel();
        $response = $cancelResponse['response'] ?? [];
        $statusCode = $cancelResponse['status_code'] ?? 200;
        $message = $cancelResponse['message'] ?? '';
    
        return (new BaseResource($response))
            ->withMessage($message)
            ->response()
            ->setStatusCode($statusCode);
    }

    // Cancel the subscription immediately and cut paid features
    public function hardCancel(Request $request): JsonResponse
    {
        $cancelResponse = $this->subscriptionService->hardCancel();
        $response = $cancelResponse['response'] ?? [];
        $statusCode = $cancelResponse['status_code'] ?? 200;
        $message = $cancelResponse['message'] ?? '';
    
        return (new BaseResource($response))
            ->withMessage($message)
            ->response()
            ->setStatusCode($statusCode);
    }

    public function resume(Request $request): JsonResponse
    {
        $resumeResponse = $this->subscriptionService->resume();
        $response = $resumeResponse['response'] ?? [];
        $statusCode = $resumeResponse['status_code'] ?? 200;
        $message = $resumeResponse['message'] ?? '';

        return (new BaseResource($response))
            ->withMessage($message)
            ->response()
            ->setStatusCode($statusCode);
    }

    public function getUserSubscription(Request $request): JsonResponse
    {
        $user = $request->user();
        $activeSubscription = $this->subscriptionService->getActiveSubscription($user, false);

        // If no live row exists, return an explicit structural fallback state
        if (!$activeSubscription) {
            return response()->json(['data' => null], 200);
        }

        // Pass the Cashier model directly to the resource
        return (new SubscriptionResource($activeSubscription))
            ->response()
            ->setStatusCode(200);
    }
}