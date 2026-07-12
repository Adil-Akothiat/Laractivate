<?php

namespace App\Listeners;

use App\Services\System\SystemSupportService;
use Illuminate\Auth\Events\Login;
use App\Models\ActivityLog;

class LogSuccessfulLogin
{
    public function __construct()
    {
        // 
    }

    public function handle(Login $event): void
    {
        $alreadyLogged = ActivityLog::where('user_id', $event->user->id)
        ->where('event', 'auth.login')
        ->where('created_at', '>=', now()->subSeconds(5))
        ->exists();

        if (!$alreadyLogged) {
            SystemSupportService::log(
                'Logged into the system', 
                'auth.login',
                [],
                $event->user->id
            );
        }
    }
}