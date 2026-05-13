<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\User\SecurityController;

Route::prefix('security')->group(function() {
    Route::post('/password', [SecurityController::class, 'changePassword']);
    Route::prefix('/two-factor')->group(function() {
        Route::post('/init', [SecurityController::class, 'init']);
        Route::post('/enable', [SecurityController::class, 'enable']);
        Route::put('/disable', [SecurityController::class, 'disable']);
        Route::post('/regenerate-codes', [SecurityController::class, 'regenerateCodes']);
    });
});