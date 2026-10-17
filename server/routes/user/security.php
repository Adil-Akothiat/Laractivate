<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\User\SecurityController;

Route::prefix('security')->group(function() {
    // Password Management
    Route::patch('/password', [SecurityController::class, 'changePassword']);

    // Two-Factor Authentication (2FA) Management
    Route::prefix('two-factor')->group(function() {
        Route::post('/init', [SecurityController::class, 'init']);
        Route::post('/enable', [SecurityController::class, 'enable']);
        Route::patch('/disable', [SecurityController::class, 'disable']);
        Route::post('/regenerate-codes', [SecurityController::class, 'regenerateCodes']);
    });
});