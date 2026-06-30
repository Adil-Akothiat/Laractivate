<?php

namespace App\Observers;

use App\Models\User;
use App\Services\System\SystemSupportService;

class UserObserver
{
    public function __construct()
    {
        $this->systemSupport = new SystemSupportService();
    }
    /**
     * Handle the User "created" event.
    */
    public function created(User $user): void
    {
        SystemSupportService::log(
            'Account created', 
            'user.created',
            [],
            $user->id
        );
    }

    /**
     * Handle the User "updated" event.
    */
    public function updated(User $user): void
    {
        // 1. Password Change
        if ($user->wasChanged('password')) {
            SystemSupportService::log(
                'Changed account password', 
                'auth.password_update',
                [],
                $user->id
            );
            // notify
            $this->systemSupport->security(
                $user,
                'Password changed!',
                'Your password was successfully updated. If this wasn’t you, please secure your account immediately.'
            );
        }

        // 2. Profile Info Change (Name or Email)
        if ($user->wasChanged(['first_name', 'last_name', 'avatar'])) {
            SystemSupportService::log(
                'Updated profile information', 
                'profile.update',
                [
                    'old' => array_intersect_key($user->getOriginal(), array_flip(['first_name', 'last_name', 'avatar'])),
                    'new' => $user->only(['first_name', 'last_name', 'avatar'])
                ],
                $user->id
            );
            // notify
            $this->systemSupport->success(
                $user,
                'Account Information Changed',
                "We noticed a change to your account details. If this wasn't you, please review your security settings.",
                '/settings/activity-logs'
            );
        }

        // 3. 2FA Toggle (Assuming your column is named 'two_factor_enabled')
        if ($user->wasChanged('two_factor_enabled')) {
            $enableOrDisable = $user->two_factor_enabled ? 'enabled' : 'disabled';
            $status = $enableOrDisable;
            SystemSupportService::log(
                "{$status} Two-Factor Authentication", 
                'auth.2fa_toggle',
                [],
                $user->id
            );
            // notify
            $this->systemSupport->security(
                $user,
                'Security Alert: Two-Factor Authentication '.ucfirst($enableOrDisable),
                'Two-factor authentication has been successfully '. $enableOrDisable .' on your account. If this wasn’t you, please secure your account immediately.'
            );
        }
    }

    /**
     * Handle the User "deleted" event.
     */
    public function deleted(User $user): void
    {
        //
    }

    /**
     * Handle the User "restored" event.
     */
    public function restored(User $user): void
    {
        //
    }

    /**
     * Handle the User "force deleted" event.
     */
    public function forceDeleted(User $user): void
    {
        //
    }
}
