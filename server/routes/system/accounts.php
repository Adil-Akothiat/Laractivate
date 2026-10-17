<?php

use App\Http\Controllers\Api\Workspace\Billing\InvoiceController;
use App\Http\Controllers\Api\System\AccountController;
use App\Http\Controllers\Api\System\ActivityLogController;
use App\Http\Controllers\Api\System\RoleController;
use Illuminate\Support\Facades\Route;

 // Account
Route::prefix('accounts')->group(function() {
    Route::middleware('permission:system.accounts.view,system.accounts.manage')->group(function() {
        Route::get('/', [AccountController::class, 'index']);
        Route::get('/{user}', [AccountController::class, 'show']);
        
        // Activity Logs
        Route::get('/{user}/activity-logs', [ActivityLogController::class, 'show']);

        // billing
        Route::get('/{user}/billing/invoices', [InvoiceController::class, 'show']);
    });

    Route::middleware('permission:system.accounts.manage')->group(function() {
        
        // CRUD
        Route::post('/', [AccountController::class, 'store']);
        Route::put('/{user}', [AccountController::class, 'update']);
        Route::delete('/{user}', [AccountController::class, 'destroy']);
        Route::put('/{user}/update-avatar', [AccountController::class, 'updateAvatar']);

        // Security
        Route::put('/{user}/security/password', [AccountController::class, 'changePassword']);
        Route::delete('/{user}/security/two-factor', [AccountController::class, 'disableTwoFactor']);
        
        // session management
        Route::get('/{user}/sessions', [AccountController::class, 'getSessions']);
        Route::put('/{user}/sessions/{sessionId}', [AccountController::class, 'revokeSession']);
        Route::put('/{user}/sessions', [AccountController::class, 'revokeAllSessions']);
        Route::delete('/{user}/sessions/clear-history', [AccountController::class, 'clearHistory']);
        
        // Role
        Route::post('/{user}/{role}/assign', [RoleController::class, 'assignRole']);
        Route::delete('/{user}/{role}/unassign', [RoleController::class, 'unassignRole']);
    });
});