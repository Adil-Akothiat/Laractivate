<?php
use Illuminate\Support\Facades\Route;

// system
Route::middleware(['scope:system'])->prefix('system')->group(function() {
    require __DIR__ .'/notifications.php';
    require __DIR__ .'/dashboard.php';
    require __DIR__ .'/roles.php';
    require __DIR__ .'/accounts.php';
});