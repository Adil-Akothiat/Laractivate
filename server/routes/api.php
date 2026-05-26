<?php
use Illuminate\Support\Facades\Route;

require base_path('routes/base_api/auth/index.php');

Route::middleware(['auth:api', 'check.revocation'])->group(function() {
    require base_path('routes/base_api/user/index.php');
    require base_path('routes/base_api/system/index.php');
    require base_path('routes/base_api/access/index.php');
    require base_path('routes/base_api/billing/index.php');
});