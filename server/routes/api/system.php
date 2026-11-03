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
    Route::middleware('permission:system.dashboard.view')
        ->get('/dashboard', [DashboardController::class, 'index'])
        ->name('system.dashboard.index');

    // Roles
    Route::prefix('roles')->group(function() {
        Route::middleware('permission:system.roles.view,system.roles.manage')->group(function() {
            Route::get('/', [RoleController::class, 'index'])
                ->name('system.roles.index');
            Route::get('/{id}', [RoleController::class, 'show'])
                ->name('system.roles.show');
            Route::get('/permissions', [RoleController::class, 'getPermissions'])
                ->name('system.roles.getPermissions');
        });
        
        // only for super admins or users with 'roles.manage'
        Route::middleware('permission:system.roles.manage')->group(function() {
            Route::post('/', [RoleController::class, 'store'])
                ->name('system.roles.store');
            Route::put('/{id}', [RoleController::class, 'update'])
                ->name('system.roles.update');
            Route::delete('/{id}', [RoleController::class, 'destroy'])
                ->name('system.roles.destroy');
        });
    });

    
    // Account
    Route::prefix('accounts')->group(function() {
        Route::middleware('permission:system.accounts.view,system.accounts.manage')->group(function() {
            Route::get('/', [AccountController::class, 'index'])
                ->name('system.accounts.index');
            Route::get('/{user}', [AccountController::class, 'show'])
                ->name('system.accounts.show');
            
            // Activity Logs
            Route::get('/{user}/activity-logs', [ActivityLogController::class, 'show'])
                ->name('system.accounts.activityLogs');

            // billing
            Route::get('/{user}/billing/invoices', [InvoiceController::class, 'show'])
                ->name('system.accounts.billing.invoices');
        });

        Route::middleware('permission:system.accounts.manage')->group(function() {
            // CRUD
            Route::post('/', [AccountController::class, 'store'])
                ->name('system.accounts.store');
            Route::put('/{user}', [AccountController::class, 'update'])
                ->name('system.accounts.update');
            Route::delete('/{user}', [AccountController::class, 'destroy'])
                ->name('system.accounts.destroy');
            Route::put('/{user}/update-avatar', [AccountController::class, 'updateAvatar'])
                ->name('system.accounts.updateAvatar');

            // Security
            Route::put('/{user}/security/password', [AccountController::class, 'changePassword'])
                ->name('system.accounts.changePassword');
            Route::delete('/{user}/security/two-factor', [AccountController::class, 'disableTwoFactor'])
                ->name('system.accounts.disableTwoFactor');
            
            // session management
            Route::get('/{user}/sessions', [AccountController::class, 'getSessions'])
                ->name('system.accounts.getSessions');
            Route::put('/{user}/sessions/{sessionId}', [AccountController::class, 'revokeSession'])
                ->name('system.accounts.revokeSession');
            Route::put('/{user}/sessions', [AccountController::class, 'revokeAllSessions'])
                ->name('system.accounts.revokeAllSessions');
            Route::delete('/{user}/sessions/clear-history', [AccountController::class, 'clearHistory'])
                ->name('system.accounts.clearHistory');
            
            // Role
            Route::post('/{user}/{role}/assign', [RoleController::class, 'assignRole'])
                ->name('system.accounts.assignRole');
            Route::delete('/{user}/{role}/unassign', [RoleController::class, 'unassignRole'])
                ->name('system.accounts.unassignRole');
        });
    });
});