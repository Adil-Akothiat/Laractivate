<?php

namespace App\Http\Controllers\Api\Billing;

use App\Http\Controllers\Controller;
use App\Services\Billing\{PlanService, InvoiceService, SubscriptionService};
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Resources\System\BaseResource;
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
        $this->stripe = new StripeClient(config('cashier.secret') ?? env('STRIPE_SECRET'));
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
}