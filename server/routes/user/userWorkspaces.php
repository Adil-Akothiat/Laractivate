<?php

/*
|--------------------------------------------------------------------------
| User Workspace Memberships & Context Switching
|--------------------------------------------------------------------------
| These routes handle personal workspace discovery, creation, and context 
| switching. They do NOT manage workspace settings (which belong to tenant tier).
*/

use App\Http\Controllers\Api\User\UserWorkspaceController;
use Illuminate\Support\Facades\Route;

Route::prefix('workspaces')->group(function() {
    Route::get('/', [UserWorkspaceController::class, 'index']);
    Route::post('/', [UserWorkspaceController::class, 'store']);
    Route::post('/switch', [UserWorkspaceController::class, 'switchWorkspace']);
});