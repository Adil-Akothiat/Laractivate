<?php

use App\Http\Controllers\Api\Workspace\Billing\PlanController;
use Illuminate\Support\Facades\Route;

Route::get('/pricing', [PlanController::class, 'index']);