<?php
use App\Http\Controllers\Api\Billing\{
    CheckoutController, 
    StripeWebhookController, 
    InvoiceController, 
    BillingPortalController, 
    PlanController
};

// 🔓 Public routes - React needs to fetch plans before authentication
Route::get('/billing/plans', [PlanController::class, 'index']);

// 🔒 Protected routes - Only authenticated users can access billing management
Route::middleware('auth:api')->group(function () {
    Route::post('/billing/checkout', [CheckoutController::class, 'createSession']);
    Route::post('/billing/portal', [BillingPortalController::class, 'createSession']);
    Route::middleware('permission:all')->get('/billing/invoices', [InvoiceController::class, 'index']);
});

// 🌐 Stripe Webhook Endpoint (Exempt from auth)
Route::post('/stripe/webhook', [StripeWebhookController::class, 'handle']);