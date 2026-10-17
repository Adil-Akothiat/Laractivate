<?php

namespace App\Listeners;


use Illuminate\Auth\Events\PasswordReset;
use App\Services\System\SystemActivityLogService;

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
            (new SystemActivityLogService())->log(
                'Password successfully reset via email link', 
                'auth.password_reset_completed',
                [],
                $user->id
            );
        }
    }
}
