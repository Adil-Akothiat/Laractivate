<?php
use App\Http\Controllers\Api\Billing\{
    CheckoutController,
    InvoiceController, 
    BillingPortalController, 
    PlanController,
    SubscriptionController,
    PaymentMethodController
};
use Laravel\Cashier\Http\Controllers\WebhookController;

Route::prefix('/billing')->group(function () {
    Route::get('/pricing', [PlanController::class, 'index']);

    Route::middleware('auth:api')->group(function () {
        Route::post('/checkout', [CheckoutController::class, 'createSession']);
        Route::post('/portal', [BillingPortalController::class, 'createSession']);

        Route::prefix('/subscription')->group(function() {
            Route::get('/', [SubscriptionController::class, 'getUserSubscription']);
            Route::post('/upgrade', [SubscriptionController::class, 'upgrade']);
            Route::post('/downgrade', [SubscriptionController::class, 'downgrade']);
            Route::post('/cancel', [SubscriptionController::class, 'cancel']);
            Route::post('/resume', [SubscriptionController::class, 'resume']);
            Route::post('/scheduled/cancel', [SubscriptionController::class, 'scheduledCancel']);
        });
        
        Route::middleware('permission:all')->get('/invoices', [InvoiceController::class, 'index']);
        Route::post('/subscription/preview-proration', [SubscriptionController::class, 'previewProration']);
        
        Route::get('/setup', [BillingPortalController::class, 'initializePortal']);
        Route::get('/user-pricing', [PlanController::class, 'userPricing']);

        Route::prefix('/payment-method')->group(function() {
            Route::get('/', [PaymentMethodController::class, 'show']);
            Route::post('/', [PaymentMethodController::class, 'update']);
            Route::delete('/', [PaymentMethodController::class, 'destroy']);
        });
    });
});

// 🌐 Stripe Webhook Endpoint (Exempt from auth)
Route::post('stripe/webhook', [WebhookController::class, 'handleWebhook']);