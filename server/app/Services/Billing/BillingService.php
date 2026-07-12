<?php

namespace App\Services\Billing;

use App\Models\User;
use Stripe\Event;

class BillingService
{
    public function __construct(
        protected WebhookVerificationService $verificationService,
        protected CheckoutService            $checkoutService,
        protected SubscriptionService        $subscriptionService,
        protected InvoiceService             $invoiceService
    ) {}

    public function createCheckoutSession(User $user, string $planSlug): string
    {
        return $this->checkoutService->createCheckoutSession($user, $planSlug);
    }

    public function verifyWebhookPayload(string $payload, ?string $sigHeader): Event
    {
        return $this->verificationService->verifyWebhookPayload($payload, $sigHeader);
    }

    public function createPortalSession(User $user): string
    {
        return $this->checkoutService->createPortalSession($user);
    }

    public function handleCheckoutSessionCompleted(object $session): bool
    {
        return $this->checkoutService->handleCheckoutSessionCompleted($session);
    }

    public function handleSubscriptionUpdated(object $subscriptionData): bool
    {
        return $this->subscriptionService->handleSubscriptionUpdated($subscriptionData);
    }

    public function handleSubscriptionDeleted(object $subscriptionData): bool
    {
        return $this->subscriptionService->handleSubscriptionDeleted($subscriptionData);
    }

    public function handleInvoicePaymentSucceeded(object $invoiceData): bool
    {
        return $this->invoiceService->handleInvoicePaymentSucceeded($invoiceData);
    }

    public function getUserInvoices(User $user, array $filters = [])
    {
        return $this->invoiceService->getUserInvoices($user, $filters);
    }

    public function isSubscribed(User $user): bool
    {
        return $this->subscriptionService->isSubscribed($user);
    }

    public function getUserSubscriptions(User $user, array $filters = [])
    {
        return $this->subscriptionService->getUserSubscriptions($user, $filters);
    }
}