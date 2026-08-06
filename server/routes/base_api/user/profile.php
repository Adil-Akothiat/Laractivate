<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\User\ProfileController;
use App\Http\Controllers\Api\System\ActivityLogController;

// profile
Route::prefix('profile')->group(function() {
    Route::put('/', [ProfileController::class, 'update']);
    Route::get('/', [ProfileController::class, 'show']);
    Route::delete('/', [ProfileController::class, 'destroy']);
    Route::put('/update-avatar', [ProfileController::class, 'updateAvatar']);
    Route::post('/deactivate', [ProfileController::class, 'deactivate']);

    // sessions
    Route::prefix('/sessions')->group(function() {
        Route::get('/', [ProfileController::class, 'getSessions']);
        Route::put('/{id}', [ProfileController::class, 'revokeSession']);
        Route::put('/', [ProfileController::class, 'revokeAllSessions']);
        Route::delete('/clear-history', [ProfileController::class, 'clearHistory']);
    });

    // activity logs
    Route::get('/activity-logs', [ActivityLogController::class, 'index']);

    // billing
    Route::prefix('/billing')->group(function() {
        Route::get('/invoices', [ProfileController::class, 'invoicesHistory']);
        // Route::get('/subscriptions', [ProfileController::class, 'getSubscriptions']);
    });
});