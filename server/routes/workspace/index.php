<?php
use Illuminate\Support\Facades\Route;

Route::middleware(['client.context', 'scope:client'])->prefix('workspace')->group(function(){  
    require __DIR__ . '/dashboard.php';
    require __DIR__ . '/billing.php';
    require __DIR__ . '/members.php';
    require __DIR__ . '/roles.php';
    require __DIR__ . '/settings.php';
});