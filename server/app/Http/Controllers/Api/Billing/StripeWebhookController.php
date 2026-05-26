<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Models\User; // Or Member model depending on your layout
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Webhook;
use Stripe\Exception\SignatureVerificationException;
use UnexpectedValueException;

class StripeWebhookController extends Controller
{
    /**
     * Handle incoming Stripe webhook streams over the internal network.
     */
    public function handle(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $endpointSecret = config('services.stripe.webhook_secret'); // Parsed via config/services.php

        $event = null;

        try {
            // 1. Cryptographically verify the event payload came from Stripe
            $event = Webhook::constructEvent(
                $payload, $sigHeader, $endpointSecret
            );
        } catch (UnexpectedValueException $e) {
            Log::error('❌ Invalid Stripe Webhook Payload structure.');
            return response()->json(['error' => 'Invalid payload'], 400);
        } catch (SignatureVerificationException $e) {
            Log::error('❌ Invalid Stripe Webhook Signature verification failed.');
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        // 2. Route payload events cleanly based on type execution loops
        switch ($event->type) {
            case 'checkout.session.completed':
                $session = $event->data->object;
                $this->handleCheckoutSessionCompleted($session);
                break;

            case 'customer.subscription.updated':
                $subscription = $event->data->object;
                $this->handleSubscriptionUpdated($subscription);
                break;

            case 'customer.subscription.deleted':
                $subscription = $event->data->object;
                $this->handleSubscriptionDeleted($subscription);
                break;

            default:
                Log::info('Received unhandled Stripe event type: ' . $event->type);
        }

        return response()->json(['status' => 'success'], 200);
    }

    /**
     * Handle initial successful checkout session fulfillment context mapping.
     */
    protected function handleCheckoutSessionCompleted($session)
    {
        $userId = $session->client_reference_id; // Passed when creating checkout link
        $stripeCustomerId = $session->customer;
        $stripeSubscriptionId = $session->subscription;

        if (!$userId) {
            Log::warning('Stripe session missing client_reference_id mapping.');
            return;
        }

        $user = User::find($userId);
        if ($user) {
            // Update user role state to reflect Pro access credentials
            $user->update([
                'stripe_customer_id' => $stripeCustomerId,
                'stripe_subscription_id' => $stripeSubscriptionId,
                'plan_tier' => 'pro',
                'subscription_status' => 'active',
            ]);
            Log::info("🚀 User ID {$userId} upgraded to PRO tier via secure Webhook sync loop.");
        }
    }

    /**
     * Handle structural lifecycle changes (e.g., payment failure updates, grace periods)
     */
    protected function handleSubscriptionUpdated($subscription)
    {
        $user = User::where('stripe_subscription_id', $subscription->id)->first();
        
        if ($user) {
            $status = $subscription->status; // active, past_due, unpaid, trialing
            $user->update([
                'subscription_status' => $status,
                // Automatically revoke tier features if billing fails completely
                'plan_tier' => in_array($status, ['active', 'trialing']) ? 'pro' : 'free'
            ]);
            Log::info("🔄 Subscription updated for User ID {$user->id}. Status: {$status}");
        }
    }

    /**
     * Handle clean subscription cancellations gracefully.
     */
    protected function handleSubscriptionDeleted($subscription)
    {
        $user = User::where('stripe_subscription_id', $subscription->id)->first();

        if ($user) {
            $user->update([
                'plan_tier' => 'free',
                'subscription_status' => 'canceled',
                'stripe_subscription_id' => null
            ]);
            Log::info("🛑 Subscription canceled and access structures revoked for User ID {$user->id}.");
        }
    }
}