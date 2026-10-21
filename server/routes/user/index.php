<?php
use Illuminate\Support\Facades\Route;

Route::prefix('user')->group(function(){  
    require __DIR__ . '/profile.php';
    require __DIR__ . '/security.php';
    require __DIR__ . '/userWorkspaces.php';
    require __DIR__ . '/invitations.php';
    require __DIR__ . '/notifications.php';
});