<?php

use App\Http\Controllers\Api\User\WorkspaceInvitationController;
use Illuminate\Support\Facades\Route;

Route::prefix('workspace/invitations')->group(function () {
    Route::get('/', [WorkspaceInvitationController::class, 'index']);
    Route::delete('/{invitation}', [WorkspaceInvitationController::class, 'cancel']);
});

Route::post('invitations/accept', [WorkspaceInvitationController::class, 'accept']);