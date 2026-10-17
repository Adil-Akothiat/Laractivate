<?php
use App\Http\Controllers\Api\System\RoleController;
use Illuminate\Support\Facades\Route;

Route::prefix('roles')->group(function() {
    Route::middleware('permission:system.roles.view,system.roles.manage')->group(function() {
        Route::get('/', [RoleController::class, 'index']);
        Route::get('/{id}', [RoleController::class, 'show']);
        Route::get('/permissions', [RoleController::class, 'getPermissions']);
    });
    
    // only for super admins or users with 'roles.manage'
    Route::middleware('permission:system.roles.manage')->group(function() {
        Route::post('/', [RoleController::class, 'store']);
        Route::put('/{id}', [RoleController::class, 'update']);
        Route::delete('/{id}', [RoleController::class, 'destroy']);
    });
});