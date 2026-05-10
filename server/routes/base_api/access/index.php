<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Access\RbacController;

Route::prefix('access/rbac')->group(function() {
    Route::middleware('permission:roles.view,roles.manage')->group(function() {
        Route::get('/roles', [RbacController::class, 'index']);
        Route::get('/roles/{id}', [RbacController::class, 'show']);
        Route::get('/permissions', [RbacController::class, 'getPermissions']);
    });
    
    // only for super admins or users with 'roles.manage'
    Route::middleware('permission:roles.manage')->group(function() {
        Route::post('/roles', [RbacController::class, 'store']);
        Route::put('/roles/{id}', [RbacController::class, 'update']);
        Route::delete('/roles/{id}', [RbacController::class, 'destroy']);
    });
});
