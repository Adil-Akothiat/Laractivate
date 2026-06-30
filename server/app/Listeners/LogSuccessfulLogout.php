<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Auth\Events\Logout;
// use Illuminate\Support\Facades\Log;
use App\Models\ActivityLog;
use App\Services\System\SystemSupportService;

class LogSuccessfulLogout
{
    /**
     * Create the event listener.
     */
    public function __construct()
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
            SystemSupportService::log(
                'Logged out of the system', 
                'auth.logout',
                [],
                $event->user->id
            );
        }
    }
}
