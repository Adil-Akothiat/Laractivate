<?php
use Illuminate\Support\Facades\Route;


require base_path('routes/api/public.php');
require base_path('routes/api/auth.php');
require base_path('routes/api/admin.php');
require base_path('routes/api/user.php');
require base_path('routes/api/workspace.php');

Route::middleware(['auth:api', 'check.revocation'])->group(function() {
});