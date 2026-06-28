<?php
use App\Http\Controllers\Api\Billing\{
    CheckoutController,
    StripeWebhookController, 
    InvoiceController, 
    BillingPortalController, 
    PlanController,
    SubscriptionController
};

Route::prefix('/billing')->group(function () {
    Route::get('/pricing', [PlanController::class, 'index']);
    Route::middleware('auth:api')->group(function () {
        Route::post('/checkout', [CheckoutController::class, 'createSession']);
        Route::post('/portal', [BillingPortalController::class, 'createSession']);
        Route::middleware('permission:all')->get('/invoices', [InvoiceController::class, 'index']);
        // Route::get('/subscription', [SubscriptionController::class, 'show']);
        Route::post('/subscription/preview-proration', [SubscriptionController::class, 'previewProration']);
        Route::post('/subscription/upgrade', [SubscriptionController::class, 'upgrade']);
        Route::post('/subscription/downgrade', [SubscriptionController::class, 'downgrade']);
        Route::get('/user-pricing', [PlanController::class, 'userPricing']);
        Route::get('/setup', [BillingPortalController::class, 'initializePortal']);
    });
});

// 🌐 Stripe Webhook Endpoint (Exempt from auth)
Route::post('/stripe/webhook', [StripeWebhookController::class, 'handle']);