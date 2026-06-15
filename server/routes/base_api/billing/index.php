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
        Route::get('/subscription', [SubscriptionController::class, 'show']); // 🟢 Added
        Route::post('/subscription/preview-upgrade', [SubscriptionController::class, 'previewUpgrade']);
        Route::post('/subscription/upgrade', [SubscriptionController::class, 'upgrade']);
        Route::get('/user-pricing', [PlanController::class, 'userPricing']); // 🟢 Added
    });
});

// 🌐 Stripe Webhook Endpoint (Exempt from auth)
Route::post('/stripe/webhook', [StripeWebhookController::class, 'handle']);