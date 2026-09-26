<?php
use App\Http\Controllers\Api\User\WorkspaceController;
use Illuminate\Support\Facades\Route;

Route::prefix('workspaces')->group(function() {
    Route::post('/switch-workspace', [WorkspaceController::class, 'switchWorkspace']);
    Route::get('/all', [WorkspaceController::class, 'index']);
    Route::post('/', [WorkspaceController::class, 'store']);
});