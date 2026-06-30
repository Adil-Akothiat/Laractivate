# Notifications Guide

## Standard Implementation Pattern
Notifications in **AuthPanel** are designed to be polymorphic. A single notification class can be delivered as an email, a database record for a frontend dashboard, or a Slack message.

1. **The Constructor**
We pass a **$details** array or a specific Model into the constructor. This keeps the notification focused purely on formatting the data it was given.
2. **Delivery Channels (`via`)**
The `via` method determines the transport. For AuthPanel, we prioritize the `database` channel to feed the user's "In-App" notification center.

## Example: `GeneralAppNotification`

```php
class GeneralAppNotification extends Notification
{
    public function __construct(protected array $details) {}

    /**
     * Choose the channels.
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * Formatted for the Database/Frontend.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title'   => $this->details['title'],
            'message' => $this->details['message'],
            'type'    => $this->details['type'] ?? 'info',
            'icon'    => $this->details['icon'] ?? 'bell',
        ];
    }
}
```
## Best Practices
- **Use `toArray()`**: Always provide a `toArray` or `toDatabase` representation. This allows your React/Next.js frontend to display a notification bell with consistent data.
- **Asynchronous Delivery**: Always use the `Queueable` trait and consider implementing `ShouldQueue` for mail or third-party API channels to prevent HTTP timeouts.
- **Clean Templates**: If a notification becomes too complex (e.g., a detailed HTML email), move the content to a dedicated Blade view using `->view()` within the `MailMessage`.