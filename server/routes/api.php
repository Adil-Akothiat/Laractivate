<?php
use Illuminate\Support\Facades\Route;


require base_path('routes/api/public.php');
require base_path('routes/api/auth.php');

Route::middleware(['auth:api', 'check.revocation'])->group(function() {
    require base_path('routes/api/system.php');
    require base_path('routes/api/user.php');
    require base_path('routes/api/workspace.php');
});