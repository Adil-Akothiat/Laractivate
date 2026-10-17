<?php

namespace App\Listeners;

use App\Models\ActivityLog;
use App\Services\System\SystemActivityLogService;
use Illuminate\Auth\Events\Login;

class LogSuccessfulLogin
{
    public function __construct(
        protected SystemActivityLogService $logService
    )
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
            
            $this->logService->log(
                'Logged into the system', 
                'auth.login',
                [],
                $event->user->id
            );
        }
    }
}