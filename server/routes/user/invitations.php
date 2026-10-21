<?php

use App\Http\Controllers\Api\User\InvitationController;
use Illuminate\Support\Facades\Route;

Route::prefix('invitations')->group(function () {
    Route::get('/', [InvitationController::class, 'index']);
    Route::post('/{id}/accept', [InvitationController::class, 'accept']);
    Route::delete('/{id}/decline', [InvitationController::class, 'decline']);
});
