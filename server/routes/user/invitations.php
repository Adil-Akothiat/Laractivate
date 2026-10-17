<?php

use App\Http\Controllers\Api\User\InvitationController;
use Illuminate\Support\Facades\Route;

Route::prefix('workspace/invitations')->group(function () {
    Route::get('/', [InvitationController::class, 'index']);
    Route::delete('/{invitation}', [InvitationController::class, 'cancel']);
});

Route::post('invitations/accept', [InvitationController::class, 'accept']);