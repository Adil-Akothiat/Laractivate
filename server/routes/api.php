<?php
use Illuminate\Support\Facades\Route;


require base_path('routes/public/index.php');

Route::middleware(['auth:api', 'check.revocation'])->group(function() {
    require base_path('routes/user/index.php');
    require base_path('routes/system/index.php');
    require base_path('routes/workspace/index.php');
});