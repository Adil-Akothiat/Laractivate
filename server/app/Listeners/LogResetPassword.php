<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Services\System\SystemSupportService;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Log;

class LogResetPassword
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
        public function handle(PasswordReset $event): void
        {
            // $event->user contains the User model instance
            $user = $event->user;
            // Log::info('USER', ['user'=>$user]);
        if ($user) {
            SystemSupportService::log(
                'Password successfully reset via email link', 
                'auth.password_reset_completed',
                [],
                $user->id
            );
        }
    }
}
