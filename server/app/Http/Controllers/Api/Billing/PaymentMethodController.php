<?php

namespace App\Http\Controllers\Api\Billing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\Billing\PaymentMethodService;
use App\Http\Resources\Billing\PaymentMethodCollection;
use App\Http\Resources\System\BaseResource;
use Illuminate\Support\Facades\Log;


class PaymentMethodController extends Controller
{
    public function __construct(
        protected PaymentMethodService $paymentMethodService
    ){
        // 
    }

    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        $defaultPaymentMethod = $user->defaultPaymentMethod();
        $paymentMethods = $user->paymentMethods();

        return (new PaymentMethodCollection($paymentMethods, $defaultPaymentMethod))->response()->setStatusCode(200);
    }

    public function setAsDefaultPaymentMethod(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        try {
            $user->updateDefaultPaymentMethod($id);
            return (new BaseResource([]))->withMessage('Default payment method updated.')->response()->setStatusCode(200);

        } catch (\Exception $e) {
            return (new BaseResource([]))->withMessage('Unable to set default payment method.')->response()->setStatusCode(422);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'payment_method_id' => ['required', 'string']
        ]);

        $user = $request->user();
        $paymentMethodId = $request->input('payment_method_id');

        try {
            $paymentMethod = $user->addPaymentMethod($paymentMethodId);
            if (!$user->hasDefaultPaymentMethod()) {
                $user->updateDefaultPaymentMethod($paymentMethod->id);
            }
            return (new BaseResource([]))->withMessage('Payment method saved successfully.')->response()->setStatusCode(201);
        } catch (\Exception $e) {
            return (new BaseResource([]))->withMessage('Error '.$e->getMessage)->response();
        }
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        $defaultPaymentMethod = $user->defaultPaymentMethod();

        try {
            $paymentMethod = $user->findPaymentMethod($id);

            if (!$paymentMethod) {
                return (new BaseResource([]))->withMessage('Payment method not found.')->response()->setStatusCode(404);
            }
            // Log::info('info pm: => ', ['paymentMethod'=> $paymentMethod]);
            if($paymentMethod->id === $defaultPaymentMethod->id):
                return (new BaseResource([]))->withMessage('You cannot delete the default payment method.')->response()->setStatusCode(422);
            endif;
            // Remove payment method from Stripe
            $paymentMethod->delete();

            return (new BaseResource([]))->withMessage('Payment method removed.')->response()->setStatusCode(200);

        } catch (\Exception $e) {
            return (new BaseResource([]))->withMessage('Failed to deleted payment method.')->response()->setStatusCode(422);
        }
    }

    public function createSetupIntent(Request $request): JsonResponse
    {
        $user = $request->user();
        $setupIntent = $user->createSetupIntent([
            'payment_method_types' => ['card']
        ]);
        return (new BaseResource(['client_secret' => $setupIntent->client_secret]))->response()->setStatusCode(200);
    }
}