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
        
        Route::post('/subscription/upgrade', [SubscriptionController::class, 'upgrade']);
        Route::post('/subscription/downgrade', [SubscriptionController::class, 'downgrade']);
        ROute::post('/subscription/cancel', [SubscriptionController::class, 'cancel']);
        Route::post('/subscription/resume', [SubscriptionController::class, 'resume']);
        
        Route::middleware('permission:all')->get('/invoices', [InvoiceController::class, 'index']);
        Route::post('/subscription/preview-proration', [SubscriptionController::class, 'previewProration']);
        
        Route::get('/setup', [BillingPortalController::class, 'initializePortal']);
        Route::get('/user-pricing', [PlanController::class, 'userPricing']);
    });
});

// 🌐 Stripe Webhook Endpoint (Exempt from auth)
Route::post('/stripe/webhook', [StripeWebhookController::class, 'handle']);