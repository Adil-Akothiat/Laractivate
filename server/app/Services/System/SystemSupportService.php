<?php

namespace App\Services\System;

use App\Models\{ User,ActivityLog };
use App\Notifications\GeneralAppNotification;
use Illuminate\Support\Facades\Request;

class SystemSupportService
{
    /**
     * Send a standard success notification
    */
    public function success(User $user, string $title, string $message, string $url = '/dashboard'): void
    {
        $this->send($user, [
            'title'   => $title,
            'message' => $message,
            'url'     => $url,
            'type'    => 'success',
            'icon'    => 'check' // Matches your React iconMap
        ]);
    }

    /**
     * Send a security or warning alert
     */
    public function security(User $user, string $title, string $message, string $url='/settings/activity-logs'): void
    {
        $this->send($user, [
            'title'   => $title,
            'message' => $message,
            'url'     => $url,
            'type'    => 'warning',
            'icon'    => 'alert'
        ]);
    }

    /**
     * Send an informational notification
     */
    public function info(User $user, string $title, string $message, string $url = '/dashboard'): void
    {
        $this->send($user, [
            'title'   => $title,
            'message' => $message,
            'url'     => $url,
            'type'    => 'info',
            'icon'    => 'info' // Matches your React iconMap
        ]);
    }

    /**
     * Send a welcome or registration notification
     */
    public function welcome(User $user, string $title, string $message): void
    {
        $user->notifications()
        ->where('type', GeneralAppNotification::class)
        ->where('data', 'LIKE', '%user-plus%') 
        ->delete();
        $this->send($user, [
            'title'   => $title,
            'message' => $message,
            'url'     => '/dashboard',
            'type'    => 'success',
            'icon'    => 'user-plus' // Matches your React iconMap
        ]);
    }

    /**
     * Send an email verification reminder
     */
    public function emailVerification(User $user, string $title, string $message): void
    {
        // Optional: Check if an unread verification notification already exists 
        // to avoid clogging the database.
        $exists = $user->unreadNotifications()
            ->where('data->icon', 'mail')
            ->exists();

        if (!$exists) {
            $this->send($user, [
                'title'   => $title,
                'message' => $message,
                'url'     => '/settings/profile', // Direct them to where they can resend/verify
                'type'    => 'warning',
                'icon'    => 'mail' // Matches your React iconMap: "✉️"
            ]);
        }
    }

    /**
     * A generic method for custom payloads
     */
    public function send(User $user, array $details): void
    {
        // Ensure a default icon if one isn't provided
        if (!isset($details['icon'])) {
            $details['icon'] = 'bell';
        }

        $user->notify(new GeneralAppNotification($details));
    }

    public static function log($description, $event, $properties = [], $userId=null)
    {
        $finalUserId = $userId ?? auth()->id();
        if(!$finalUserId):
            return;
        endif;
        
        $session = new SessionService();
        $request = request();
        $metadata = $session->buildMetadata(
            $request->header('User-Agent'),
            $request->ip(),
            $request->header('Sec-CH-UA', '')
        );
        ActivityLog::create([
            'users_id' => $finalUserId,
            'description' => $description,
            'event' => $event,
            'properties' => [...$metadata, ...$properties],
            'ip_address' => $request->ip(),
            'user_agent' => $request->header('User-Agent')
        ]);
    }
}