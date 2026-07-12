<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\System\{DashboardController, ActivityLogsController};

// system
Route::prefix('system')->group(function() {
    require __DIR__ .'/notifications.php';
    require __DIR__ .'/dashboard.php';
});