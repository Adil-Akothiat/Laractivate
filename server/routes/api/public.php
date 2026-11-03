<?php

use App\Http\Controllers\Api\Workspace\Billing\PlanController;
use Illuminate\Support\Facades\Route;

Route::prefix('public')->group(function() {
    Route::get('/pricing', [PlanController::class, 'publicIndex'])->name('public.pricing');
});