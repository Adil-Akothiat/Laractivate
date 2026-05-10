<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\System\DashboardController;

// 1. General Dashboard (Requires basic entry permission)
Route::prefix('dashboard')->middleware('permission:dashboard.view')->group(function() {
    Route::get('/', [DashboardController::class, 'index']);
    Route::middleware('permission:all')->group(function() {
        Route::get('/super-admin', [DashboardController::class, 'superAdminIndex']);
    });
});