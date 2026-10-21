<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\System\NotificationsController;

Route::prefix('notifications')->group(function() {       
    Route::get('/', [NotificationsController::class, 'index']);
    Route::post('/', [NotificationsController::class, 'markAllRead']);
    Route::patch('/{id}', [NotificationsController::class, 'markAsRead']);
});
