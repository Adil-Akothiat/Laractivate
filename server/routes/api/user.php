<?php
use App\Http\Controllers\Api\User\InvitationController;
use App\Http\Controllers\Api\User\NotificationsController;
use App\Http\Controllers\Api\User\ProfileController;
use App\Http\Controllers\Api\User\SecurityController;
use App\Http\Controllers\Api\User\UserWorkspaceController;
use Illuminate\Support\Facades\Route;

Route::prefix('user')->group(function(){
    // me
    Route::get('/', [ProfileController::class, 'me'])
        ->name('user.me');
    // Profile
    Route::prefix('profile')->group(function() {
        Route::get('/', [ProfileController::class, 'show'])
            ->name('user.profile.show');
        Route::put('/', [ProfileController::class, 'update'])
            ->name('user.profile.update');
        Route::delete('/', [ProfileController::class, 'destroy'])
            ->name('user.profile.destroy');
        Route::put('/update-avatar', [ProfileController::class, 'updateAvatar'])
            ->name('user.profile.updateAvatar');
        Route::post('/deactivate', [ProfileController::class, 'deactivate'])
            ->name('user.profile.deactivate');
    });

    // Security
    Route::prefix('security')->group(function() {
        // sessions
        Route::prefix('/sessions')->group(function() {
            Route::get('/', [SecurityController::class, 'getSessions'])
                ->name('user.security.getSessions');
            Route::put('/{id}', [SecurityController::class, 'revokeSession'])
                ->name('user.security.revokeSession');
            Route::put('/', [SecurityController::class, 'revokeAllSessions'])
                ->name('user.security.revokeAllSessions');
            Route::delete('/clear-history', [SecurityController::class, 'clearHistory'])
                ->name('user.security.clearHistory');
        });

        // activity logs
        Route::get('/activity-logs', [SecurityController::class, 'activityLogs'])
            ->name('user.security.activityLogs');;
        // Password Management
        Route::patch('/password', [SecurityController::class, 'changePassword'])
            ->name('user.security.changePassword');

        // Two-Factor Authentication (2FA) Management
        Route::prefix('two-factor')->group(function() {
            Route::post('/init', [SecurityController::class, 'init'])
                ->name('user.security.tfa.init');
            Route::post('/enable', [SecurityController::class, 'enable'])
                ->name('user.security.tfa.enable');
            Route::patch('/disable', [SecurityController::class, 'disable'])
                ->name('user.security.tfa.disable');
            Route::post('/regenerate-codes', [SecurityController::class, 'regenerateCodes'])
                ->name('user.security.tfa.regenerateCodes');
        });
    });

    // user workspace
    Route::prefix('workspaces')->middleware('client.context')->group(function() {
        Route::get('/', [UserWorkspaceController::class, 'index'])
            ->name('user.workspaces.index');
        Route::post('/', [UserWorkspaceController::class, 'store'])
            ->name('user.workspaces.store');
        Route::post('/switch', [UserWorkspaceController::class, 'switchWorkspace'])
            ->name('user.workspaces.switch');
        Route::get('/verify/{slug}', [UserWorkspaceController::class, 'verifySlug'])
            ->name('user.workspaces.verifySlug');
    }); 

    // 
    Route::prefix('invitations')->group(function () {
        Route::get('/', [InvitationController::class, 'index'])
            ->name('user.invitations.index');
        Route::post('/{id}/accept', [InvitationController::class, 'accept'])
            ->name('user.invitations.accept');
        Route::delete('/{id}/decline', [InvitationController::class, 'decline'])
            ->name('user.invitations.decline');
    });

    // Notifications    
    Route::prefix('notifications')->group(function() {       
        Route::get('/', [NotificationsController::class, 'index'])
            ->name('user.notifications.index');
        Route::post('/', [NotificationsController::class, 'markAllRead'])
            ->name('user.notifications.markAllRead');
        Route::patch('/{id}', [NotificationsController::class, 'markAsRead'])
            ->name('user.notifications.markAsRead');
    });
});