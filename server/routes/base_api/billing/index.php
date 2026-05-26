<?php
use App\Http\Controllers\Api\Billing\{CheckoutController, StripeWebhookController};

Route::post('/billing/checkout', [CheckoutController::class, 'createSession']);
Route::post('/stripe/webhook', [StripeWebhookController::class, 'handle']);