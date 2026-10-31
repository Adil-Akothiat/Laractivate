<?php
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\User\InvitationController;
use App\Http\Controllers\Api\User\NotificationsController;
use App\Http\Controllers\Api\User\ProfileController;
use App\Http\Controllers\Api\User\SecurityController;
use App\Http\Controllers\Api\User\UserWorkspaceController;
use Illuminate\Support\Facades\Route;

Route::prefix('user')->group(function(){
    // Profile
    Route::prefix('profile')->group(function() {
        Route::get('/', [ProfileController::class, 'show']);
        Route::put('/', [ProfileController::class, 'update']);
        Route::delete('/', [ProfileController::class, 'destroy']);
        Route::put('/update-avatar', [ProfileController::class, 'updateAvatar']);
        Route::post('/deactivate', [ProfileController::class, 'deactivate']);

        // sessions
        Route::prefix('/sessions')->group(function() {
            Route::get('/', [ProfileController::class, 'getSessions']);
            Route::put('/{id}', [ProfileController::class, 'revokeSession']);
            Route::put('/', [ProfileController::class, 'revokeAllSessions']);
            Route::delete('/clear-history', [ProfileController::class, 'clearHistory']);
        });

        // activity logs
        Route::get('/activity-logs', [ProfileController::class, 'auditLogs']);
    });

    // Security
    Route::prefix('security')->group(function() {
        // Password Management
        Route::patch('/password', [SecurityController::class, 'changePassword']);

        // Two-Factor Authentication (2FA) Management
        Route::prefix('two-factor')->group(function() {
            Route::post('/init', [SecurityController::class, 'init']);
            Route::post('/enable', [SecurityController::class, 'enable']);
            Route::patch('/disable', [SecurityController::class, 'disable']);
            Route::post('/regenerate-codes', [SecurityController::class, 'regenerateCodes']);
        });
    });

    // user workspace
    Route::prefix('workspaces')->middleware('client.context')->group(function() {
        Route::get('/', [UserWorkspaceController::class, 'index']);
        Route::post('/', [UserWorkspaceController::class, 'store']);
        Route::post('/switch', [UserWorkspaceController::class, 'switchWorkspace']);
    }); 

    // Invitations
    Route::prefix('invitations')->group(function () {
        Route::get('/', [InvitationController::class, 'index']);
        Route::post('/{id}/accept', [InvitationController::class, 'accept']);
        Route::delete('/{id}/decline', [InvitationController::class, 'decline']);
    });

    // Notifications    
    Route::prefix('notifications')->group(function() {       
        Route::get('/', [NotificationsController::class, 'index']);
        Route::post('/', [NotificationsController::class, 'markAllRead']);
        Route::patch('/{id}', [NotificationsController::class, 'markAsRead']);
    });

    // me
      Route::middleware(['auth:api', 'check.revocation'])->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
    });

});