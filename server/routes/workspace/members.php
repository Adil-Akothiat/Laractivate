<?php

use App\Http\Controllers\Api\User\WorkspaceMemberController;
use Illuminate\Support\Facades\Route;

Route::prefix('workspace/members')->group(function () {
    Route::get('/', [WorkspaceMemberController::class, 'index']);
    Route::put('/{user}', [WorkspaceMemberController::class, 'updateRole']);
    Route::delete('/{user}', [WorkspaceMemberController::class, 'destroy']);
    Route::post('/invite', [WorkspaceMemberController::class, 'invite']);
});