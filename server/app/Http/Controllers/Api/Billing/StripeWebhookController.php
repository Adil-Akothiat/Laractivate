<?php

namespace App\Http\Controllers\Api\Billing;

use App\Http\Controllers\Controller;
use App\Services\Billing\BillingService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\SignatureVerificationException;
use UnexpectedValueException;

class StripeWebhookController extends Controller
{
    public function __construct(
        protected BillingService $billingService
    )
    {
        // 
    }

    public function handle(Request $request): JsonResponse
    {
        try {
            // Cryptographic handshake validation decoupled to service
            $event = $this->billingService->verifyWebhookPayload(
                $request->getContent(),
                $request->header('Stripe-Signature')
            );
        } catch (UnexpectedValueException $e) {
            Log::error('❌ Invalid Stripe Webhook Payload structure.');
            return response()->json(['error' => 'Invalid payload'], 400);
        } catch (SignatureVerificationException $e) {
            Log::error('❌ Invalid Stripe Webhook Signature verification failed.');
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        // Process routing logic
        Log::info("Event ", ['payload'=> $event]);
        switch ($event->type) {
            case 'checkout.session.completed':
                $this->billingService->handleCheckoutSessionCompleted($event->data->object);
                break;

            case 'customer.subscription.updated':
            case 'customer.subscription.created':
                $this->billingService->handleSubscriptionUpdated($event->data->object);
                break;

            case 'customer.subscription.deleted':
                $this->billingService->handleSubscriptionDeleted($event->data->object);
                break;
            
            // 🟢 NEW CASE FOR INVOICE TRACKING
            case 'invoice.payment_succeeded':
                $this->billingService->handleInvoicePaymentSucceeded($event->data->object);
                break;

            default:
                Log::info('Received unhandled Stripe event type: ' . $event->type);
        }

        return response()->json(['status' => 'success'], 200);
    }
}