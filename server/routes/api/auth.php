<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\{
    AuthController, 
    RegisterController, 
    PasswordController, 
    TwoFactorAuthController
};

Route::prefix('auth')->group(function () {
    
    // ----------------------------------------------------
    // 1. Public Routes (Accessible without authentication)
    // ----------------------------------------------------
    Route::post('/register', [RegisterController::class, 'store']);
    
    Route::post('/login', [AuthController::class, 'login'])
         ->middleware(['throttle:5000,1']);
         
    Route::post('/forgot-password', [PasswordController::class, 'forgotPassword']);
    Route::post('/reset-password', [PasswordController::class, 'resetPassword']);
    Route::get('/reset-password/validate-token', [PasswordController::class, 'validateToken']);
    Route::post('/refresh-token', [AuthController::class, 'refreshToken']);
    
    Route::post('/two-factor/verify', [TwoFactorAuthController::class, 'verifyAuthentication'])
         ->middleware('2fa.challenge');
});