<?php

namespace App\Http\Controllers\Api\Billing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\Billing\PaymentMethodService;


class PaymentMethodController extends Controller
{
    public function __construct(
        protected PaymentMethodService $paymentMethodService
    ) {}

    public function show(Request $request): JsonResponse
    {
        $data = $this->paymentMethodService->getPaymentMethodSummary($request->user());
        return response()->json($data);
    }

    public function update(Request $request): JsonResponse
    {
        $request->validate([
            'stripe_payment_method_id' => 'required|string',
        ]);

        $this->paymentMethodService->syncAndSetDefault(
            $request->user(),
            $request->stripe_payment_method_id
        );

        return response()->json(['message' => 'Payment method updated successfully.']);
    }

    public function destroy(Request $request): JsonResponse
    {
        try {
            $this->paymentMethodService->removePaymentMethod($request->user());
            return response()->json(['message' => 'Payment method removed successfully.']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], $e->getCode() ?: 400);
        }
    }
}
