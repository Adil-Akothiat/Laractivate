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
    Route::post('/register', [RegisterController::class, 'store'])->name('auth.register.store');
    
    Route::post('/login', [AuthController::class, 'login'])
        ->name('auth.login')
        ->middleware(['throttle:5000,1']);
    
    Route::middleware(['auth:api', 'check.revocation'])->post('/logout', [AuthController::class, 'logout'])->name('auth.logout');
         
    Route::post('/forgot-password', [PasswordController::class, 'forgotPassword'])
        ->name('auth.forgotPassword');
    Route::post('/reset-password', [PasswordController::class, 'resetPassword'])
        ->name('auth.resetPassword');
    Route::get('/reset-password/validate-token', [PasswordController::class, 'validateToken'])
        ->name('auth.resetPassword.validateToken');
    Route::post('/refresh-token', [AuthController::class, 'refreshToken'])
        ->name('auth.refreshToken');
    
    Route::post('/two-factor/verify', [TwoFactorAuthController::class, 'verifyAuthentication'])
        ->name('auth.twoFactor.verify')
        ->middleware('2fa.challenge');
});