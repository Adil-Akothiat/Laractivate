<?php
use App\Http\Controllers\Api\Workspace\Billing\BillingPortalController;
use App\Http\Controllers\Api\Workspace\Billing\CheckoutController;
use App\Http\Controllers\Api\Workspace\Billing\InvoiceController;
use App\Http\Controllers\Api\Workspace\Billing\PaymentMethodController;
use App\Http\Controllers\Api\Workspace\Billing\PlanController;
use App\Http\Controllers\Api\Workspace\Billing\SubscriptionController;
use App\Http\Controllers\Api\Workspace\MembersController;
use Illuminate\Support\Facades\Route;
use Laravel\Cashier\Http\Controllers\WebhookController;

Route::middleware(['client.context', 'scope:client'])->prefix('workspace')->group(function(){  
    // Dashboard

    // Billing
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

    // Members
    Route::prefix('members')->group(function () {
        Route::get('/', [MembersController::class, 'index']);
        Route::patch('/{user}', [MembersController::class, 'updateRole']);
        Route::delete('/{user}', [MembersController::class, 'destroy']);
        Route::post('/invite', [MembersController::class, 'invite']);
    });

    // Roles
    
    // Settings

});