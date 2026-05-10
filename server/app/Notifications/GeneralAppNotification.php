<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class GeneralAppNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct($details)
    {
        $this->details = $details;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        $channels = ['database'];
        // Only add 'mail' if we explicitly ask for it
        if (!empty($this->details['send_email'])) {
            $channels[] = 'mail';
        }

        return $channels;
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Reset Your Password - ' . config('app.name'))
            ->greeting('Hello!')
            ->line($this->details['message'] ?? 'You requested a password reset.')
            ->action('Reset Password', $this->details['url'])
            ->line('If you did not request this, no further action is required.')
            ->line('This link will expire in 60 minutes.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title'   => $this->details['title'] ?? 'New Notification',
            'message' => $this->details['message'] ?? 'You have a new update.',
            'action'  => $this->details['url'] ?? '#',
            'type'  => $this->details['type'] ?? 'info',
            'icon'  => $this->details['icon'] ?? 'bell',
        ];
    }
}

