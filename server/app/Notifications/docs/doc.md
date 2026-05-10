# Notifications

## Purpose
The delivery system. Acts as a unified transport layer to send messages to users via multiple channels (database, mail, SMS, etc.) based on application events.

## Include
- **Channel Definitions** — Specifying where the message goes via `toMail()`, `toDatabase()`, or `toArray()`.
- **Content Formatting** — Constructing message blocks, email lines, or JSON payloads for the frontend.
- **Queueing** — Implementing `ShouldQueue` to send notifications in the background without blocking the request.

## Do NOT Include
- **Trigger Logic** — The decision of whether to notify a user belongs in a Service or Listener, not here.
- **Data Fetching** — Pass all necessary data into the notification constructor instead of querying inside the class.

## Directory Structure

```
Notifications/
├─ GeneralAppNotification.php   ← flexible notification for system updates
└─ docs/
   ├─ doc.md
   └─ notifications.md
```

## Docker Commands

```bash
# Create a notification
docker-compose exec app php artisan make:notification GeneralAppNotification

# Send a notification on demand (tinker)
docker-compose exec app php artisan tinker
>>> $user = \App\Models\User::first();
>>> $user->notify(new \App\Notifications\GeneralAppNotification($data));
```

> Always implement `toArray()` alongside `toDatabase()` — the React frontend reads from the `database` channel to power the notification bell:
>
> ```php
> public function via(object $notifiable): array
> {
>     return ['database', 'mail'];
> }
>
> public function toArray(object $notifiable): array
> {
>     return [
>         'title'   => $this->title,
>         'message' => $this->message,
>         'url'     => $this->url,
>     ];
> }
> ```
>
> In `UserResource`, expose the unread count to give the dashboard a real-time feel:
>
> ```php
> 'unread_notifications' => $this->unreadNotifications->count(),
> ```

## Further Reading
- [Notifications Implementation Guide](./notifications.md)