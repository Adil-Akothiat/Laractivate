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
    ) {
        // 
    }

    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        $defaultPaymentMethod = $user->defaultPaymentMethod();
        $paymentMethods = $user->paymentMethods();

        $formattedMethods = $paymentMethods->map(function ($method) use ($defaultPaymentMethod) {
            return [
                'id' => $method->id,
                'brand' => $method->card->brand,          // visa, mastercard, etc.
                'last4' => $method->card->last4,          // 4242
                'exp_month' => $method->card->exp_month,
                'exp_year' => $method->card->exp_year,
                'is_default' => $defaultPaymentMethod && $method->id === $defaultPaymentMethod->id
            ];
        });
        return response()->json($formattedMethods);
    }
}