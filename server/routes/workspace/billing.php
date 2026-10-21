<?php

use App\Http\Controllers\Api\Workspace\Billing\{ 
    CheckoutController, 
    InvoiceController, 
    BillingPortalController, 
    PlanController, 
    SubscriptionController, 
    PaymentMethodController 
};
use Illuminate\Support\Facades\Route;
use Laravel\Cashier\Http\Controllers\WebhookController;

Route::prefix('billing')->group(function () {
    
    // 1. Plans & Pricing
    Route::get('/pricing', [PlanController::class, 'userPricing']);

    // 2. Checkout & Portal Sessions
    Route::post('/checkout', [CheckoutController::class, 'createSession']);
    Route::post('/portal', [BillingPortalController::class, 'createSession']);
    Route::get('/setup', [BillingPortalController::class, 'initializePortal']);

    // 3. Subscription Management (Using PATCH for state modifications)
    Route::prefix('subscription')->group(function() {
        Route::get('/', [SubscriptionController::class, 'getUserSubscription']);
        Route::patch('/upgrade', [SubscriptionController::class, 'upgrade']);
        Route::patch('/downgrade', [SubscriptionController::class, 'downgrade']);
        Route::patch('/cancel', [SubscriptionController::class, 'cancel']);
        Route::patch('/resume', [SubscriptionController::class, 'resume']);
        Route::patch('/scheduled/cancel', [SubscriptionController::class, 'scheduledCancel']);
        Route::post('/preview-proration', [SubscriptionController::class, 'previewProration']);
    });

    // 4. Invoices History (Protected by client billing permission)
    Route::middleware('permission:client.billing.view')->get('/invoices', [InvoiceController::class, 'index']);

    // 5. Payment Methods Management
    Route::prefix('payment-method')->group(function() {
        Route::get('/', [PaymentMethodController::class, 'show']);
        Route::post('/', [PaymentMethodController::class, 'store']);
        Route::get('/setup-intent', [PaymentMethodController::class, 'createSetupIntent']);
        Route::patch('/{id}', [PaymentMethodController::class, 'setAsDefaultPaymentMethod']);
        Route::delete('/{id}', [PaymentMethodController::class, 'destroy']);
    });
});

// 🌐 Stripe Webhook Endpoint (Exempt from auth & workspace context)
Route::post('stripe/webhook', [WebhookController::class, 'handleWebhook']);