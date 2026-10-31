<?php
use App\Http\Controllers\Api\System\AccountController;
use App\Http\Controllers\Api\System\ActivityLogController;
use App\Http\Controllers\Api\System\DashboardController;
use App\Http\Controllers\Api\System\RoleController;
use App\Http\Controllers\Api\Workspace\Billing\InvoiceController;
use Illuminate\Support\Facades\Route;

// system
Route::middleware(['scope:system'])->prefix('system')->group(function() {
    
    // Dashboard
    Route::middleware('permission:system.dashboard.view')->get('/dashboard', [DashboardController::class, 'index']);

    // Roles

    Route::prefix('roles')->group(function() {
        Route::middleware('permission:system.roles.view,system.roles.manage')->group(function() {
            Route::get('/', [RoleController::class, 'index']);
            Route::get('/{id}', [RoleController::class, 'show']);
            Route::get('/permissions', [RoleController::class, 'getPermissions']);
        });
        
        // only for super admins or users with 'roles.manage'
        Route::middleware('permission:system.roles.manage')->group(function() {
            Route::post('/', [RoleController::class, 'store']);
            Route::put('/{id}', [RoleController::class, 'update']);
            Route::delete('/{id}', [RoleController::class, 'destroy']);
        });
    });

    
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
});