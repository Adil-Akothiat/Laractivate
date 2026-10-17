<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\System\DashboardController;


Route::middleware('permission:system.dashboard.view')->get('/dashboard', [DashboardController::class, 'index']);