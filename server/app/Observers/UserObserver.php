<?php

namespace App\Observers;

use App\Models\Client;
use App\Models\Role;
use App\Models\User;
use App\Services\System\SystemActivityLogService;
use App\Services\System\SystemNotificationService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UserObserver
{
    public function __construct(
        protected SystemActivityLogService $logService,
        protected SystemNotificationService $notificationService
    )
    {
        // 
    }
    /**
     * Handle the User "created" event.
    */
    public function created(User $user): void
    {
        $this->logService->log(
            'Account created', 
            'user.created',
            [],
            $user->id
        );

        DB::transaction(function() use ($user) {
            $name = $user->first_name .'-'. $user->last_name;
            $client = Client::create([
                'name'=> $name . "'s Workspace",
                'slug'=> Str::slug($name . '-' . Str::random(5)),
                'owner_id' => $user->id
            ]);

            // Role scope must be "client" not "system"
            $ownerRole = Role::where('name', 'ADMINISTRATOR')
                ->where('scope', 'client')
                ->first();
            
            if (!$ownerRole) {
                throw new \Exception("Default workspace 'ADMINISTRATOR' role not found. Please run seeders.");
            }
            $user->clients()->attach($client->id, [
                'role_id'=> $ownerRole->id
            ]);
        });
    }

    /**
     * Handle the User "updated" event.
    */
    public function updated(User $user): void
    {
        // 1. Password Change
        if ($user->wasChanged('password')) {
            $this->logService->log(
                'Changed account password', 
                'auth.password_update',
                [],
                $user->id
            );
            // notify
            $notificationService->security(
                $user,
                'Password changed!',
                'Your password was successfully updated. If this wasn’t you, please secure your account immediately.'
            );
        }

        // 2. Profile Info Change (Name or Email)
        if ($user->wasChanged(['first_name', 'last_name', 'avatar'])) {
            $this->logService->log(
                'Updated profile information', 
                'profile.update',
                [
                    'old' => array_intersect_key($user->getOriginal(), array_flip(['first_name', 'last_name', 'avatar'])),
                    'new' => $user->only(['first_name', 'last_name', 'avatar'])
                ],
                $user->id
            );
            // notify
            $notificationService->success(
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
            $this->logService->log(
                "{$status} Two-Factor Authentication", 
                'auth.2fa_toggle',
                [],
                $user->id
            );
            // notify
            $notificationService->security(
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
