# Listeners

## Purpose
Decoupled side effects. Handles secondary actions that occur after a specific event, keeping the core application flow focused and fast.

## Include
- **Logging & Auditing** — Recording login sessions, password changes, or logout events to the `ActivityLog`.
- **Notification Triggers** — Sending welcome emails or 2FA alerts after registration or login events.
- **Data Cleanup** — Removing temporary files or expired records after an associated process completes.

## Do NOT Include
- **Primary Logic** — The main task (e.g., creating a user or updating a password) must be complete before a listener runs. Listeners react, they don't lead.
- **Blocking Operations** — No heavy synchronous logic that delays the HTTP response. Implement `ShouldQueue` for any time-consuming task.

## Directory Structure

```
Listeners/
├─ LogResetPassword.php
├─ LogSuccessfulLogin.php
├─ LogSuccessfulLogout.php
└─ docs/
   ├─ doc.md
   └─ listeners.md
```

## Docker Commands

```bash
# Create an event
docker-compose exec app php artisan make:event UserLoggedIn

# Create a listener bound to an event
docker-compose exec app php artisan make:listener LogSuccessfulLogin --event=Login
docker-compose exec app php artisan make:listener LogSuccessfulLogout --event=Logout
docker-compose exec app php artisan make:listener LogResetPassword --event=PasswordReset
```

> Wire events to listeners in `AppServiceProvider::boot()` — not in a dedicated `EventServiceProvider`:
>
> ```php
> Event::listen(Login::class, LogSuccessfulLogin::class);
> Event::listen(Logout::class, LogSuccessfulLogout::class);
> Event::listen(PasswordReset::class, LogResetPassword::class);
> ```
>
> For any listener doing heavy work (emails, API calls), implement `ShouldQueue` to move it off the request cycle:
>
> ```php
> class LogSuccessfulLogin implements ShouldQueue
> {
>     public function handle(Login $event): void
>     {
>         // runs in the background
>     }
> }
> ```

## Further Reading
- [Listeners Implementation Guide](./listeners.md)