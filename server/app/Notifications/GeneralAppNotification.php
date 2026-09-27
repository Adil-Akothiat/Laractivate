<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class GeneralAppNotification extends Notification
{
    use Queueable;
    public $details;

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
        $mail = (new MailMessage)
            ->subject($this->details['subject'] ?? ($this->details['title'] ?? config('app.name')))
            ->greeting($this->details['greeting'] ?? 'Hello!');

        if (!empty($this->details['lines']) && is_array($this->details['lines'])) {
            foreach ($this->details['lines'] as $line) {
                $mail->line($line);
            }
        } else {
            $mail->line($this->details['message'] ?? 'You have a new update.');
        }

        if (!empty($this->details['url'])) {
            $mail->action($this->details['btn_text'] ?? 'View Details', $this->details['url']);
        }

        if (!empty($this->details['footer'])) {
            $mail->line($this->details['footer']);
        }

        return $mail;
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

