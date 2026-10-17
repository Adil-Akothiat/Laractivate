<?php

namespace App\Listeners;

use App\Models\ActivityLog;
use App\Services\System\SystemActivityLogService;
use Illuminate\Auth\Events\Logout;

class LogSuccessfulLogout
{
    /**
     * Create the event listener.
     */
    public function __construct(
        protected SystemActivityLogService $logService
    )
    {
        // 
    }

    /**
     * Handle the event.
     */
    public function handle(Logout $event): void
    {
       // Safety check: sometimes $event->user can be null if the session expired
        if (!$event->user) {
            return;
        }
        // Check if a logout was already recorded in the last 5 seconds
        $alreadyLoggedOut = ActivityLog::where('user_id', $event->user->id)
            ->where('event', 'auth.logout')
            ->where('created_at', '>=', now()->subSeconds(5))
            ->exists();
        if (!$alreadyLoggedOut) {
            $this->logService->log(
                'Logged out of the system', 
                'auth.logout',
                [],
                $event->user->id
            );
        }
    }
}
