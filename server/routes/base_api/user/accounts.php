<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\User\AccountsController;
use App\Http\Controllers\Api\System\ActivityLogController;
use App\Http\Controllers\Api\Access\RbacController;

 // Accounts
Route::prefix('accounts')->group(function() {
    Route::middleware('permission:accounts.view,accounts.manage')->group(function() {
        Route::get('/', [AccountsController::class, 'index']);
        Route::get('/{user}', [AccountsController::class, 'show']);
    });

    // Route::middleware('permission:accounts.manage');
    Route::middleware('permission:accounts.manage')->group(function() {
        Route::post('/', [AccountsController::class, 'store']);
        Route::put('/{user}', [AccountsController::class, 'update']);
        Route::delete('/{user}', [AccountsController::class, 'destroy']);
        Route::put('/{user}/update-avatar', [AccountsController::class, 'updateAvatar']);
        Route::put('/{user}/security/password', [AccountsController::class, 'changePassword']);
        Route::delete('/{user}/security/two-factor', [AccountsController::class, 'disableTwoFactor']);
        
        // session management
        Route::get('/{user}/sessions', [AccountsController::class, 'getSessions']);
        Route::put('/{user}/sessions/{sessionId}', [AccountsController::class, 'revokeSession']);
        Route::put('/{user}/sessions', [AccountsController::class, 'revokeAllSessions']);
        Route::delete('/{user}/sessions/clear-history', [AccountsController::class, 'clearHistory']);
        
        // logs activities
        Route::middleware('permission:logs.view')->get('/{user}/activity-logs', [ActivityLogController::class, 'show']);

        // rbac
        Route::post('/{user}/{role}/assign', [RbacController::class, 'assignRole']);
        Route::delete('/{user}/{role}/unassign', [RbacController::class, 'unassignRole']);
    });
});