<?php
use Illuminate\Support\Facades\Route;

Route::prefix('user')->group(function(){  
    require __DIR__ . '/accounts.php';
    require __DIR__ . '/profile.php';
    require __DIR__ . '/security.php';
});