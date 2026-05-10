# Listeners Guide

## Standard Implementation Pattern
In **AuthPanel**, listeners respond to specific Events (like `Illuminate\Auth\Events\Login`). This allows you to add features (like activity logging) without touching the `AuthService` or AuthController code.

### Event Connection
Listeners are automatically mapped to events in your ``EventServiceProvider`` or discovered by Laravel. They receive the `$event` object which contains the relevant data (like the `$user` or `$request`).

### Handling Side Effects
The `handle()` method is where the side effect lives. It should ideally delegate the actual work to a specialized service, such as a `SystemSupportService` or `ActivityLogService`.

### Example: `LogSuccessfulLogin`

```php
public function handle(Logout $event): void
{
    // 1. Safety check: prevent errors if the session is already null
    if (!$event->user) {
        return;
    }

    // 2. Idempotency check: prevent duplicate logs
    $alreadyLoggedOut = ActivityLog::where('users_id', $event->user->id)
        ->where('event', 'auth.logout')
        ->where('created_at', '>=', now()->subSeconds(5))
        ->exists();

    // 3. Delegate to System Service
    if (!$alreadyLoggedOut) {
        SystemSupportService::log(
            'Logged out of the system', 
            'auth.logout',
            [],
            $event->user->id
        );
    }
}
```
## Best Practices
- **Queueing**: If your listener sends an email or communicates with an external API, implement the `ShouldQueue` interface to keep the user experience snappy.
- **Fail-Safe**: Ensure that a failure in a listener (like a logging error) doesn't crash the main process. Use `try-catch` blocks where appropriate.
- **Idempotency**: Ensure that if a listener runs twice for the same event, it doesn't cause duplicate side effects (like sending two identical notifications).