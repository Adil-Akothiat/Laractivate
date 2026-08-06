<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Laravel\Cashier\Events\WebhookReceived;
use App\Services\Billing\{ CheckoutService, SubscriptionService, InvoiceService };
use Illuminate\Support\Facades\Log;


class StripeEventListener
{
    /**
     * Create the event listener.
     */
    public function __construct(
        protected CheckoutService $checkoutService,
        protected SubscriptionService $subscriptionService,
        protected InvoiceService $invoiceService
    )
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(WebhookReceived $event): void
    {
        $stripeData = $event->payload;
        $eventType = $stripeData['type'] ?? '';

        $rawObjectArray = $stripeData['data']['object'] ?? null;
        if(!$rawObjectArray) {
            Log::info("No object data in event: " . $eventType);
            return;
        };
        $stripeObject = json_decode(json_encode($rawObjectArray));

        switch($eventType)
        {
            case "checkout.session.completed":
                $this->checkoutService->handleCheckoutSessionCompleted($stripeObject);
                break;
            case "customer.subscription.created":
            case "customer.subscription.updated":
                $this->subscriptionService->handleSubscriptionUpdated($stripeObject);
                break;
            case "invoice.payment_succeeded":
                $this->invoiceService->handleInvoicePaymentSucceeded($stripeObject);
                break;
            default:
                Log::info("Unhandled event type: " . $eventType);
        }
    }
}
