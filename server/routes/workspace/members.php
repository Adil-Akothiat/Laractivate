<?php

use App\Http\Controllers\Api\Workspace\MembersController;
use Illuminate\Support\Facades\Route;

Route::prefix('members')->group(function () {
    Route::get('/', [MembersController::class, 'index']);
    Route::patch('/{user}', [MembersController::class, 'updateRole']);
    Route::delete('/{user}', [MembersController::class, 'destroy']);
    Route::post('/invite', [MembersController::class, 'invite']);
});