<?php

namespace App\Services\Billing;

use Stripe\{Webhook, Event};
use Stripe\Exception\SignatureVerificationException;


class WebhookVerificationService
{
    /**
     * Cryptographically verify that the payload genuinely originated from Stripe.
     */
    public function verifyWebhookPayload(string $payload, ?string $sigHeader): Event
    {
        $endpointSecret = config('services.stripe.webhook_secret');

        if (empty($sigHeader) || empty($endpointSecret)) {
            throw new SignatureVerificationException('Missing signature header or local verification secret key config.');
        }

        return Webhook::constructEvent($payload, $sigHeader, $endpointSecret);
    }
}