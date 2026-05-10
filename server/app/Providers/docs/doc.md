
# Service Providers

## Purpose
- **Central Connection Hub**: Providers bind classes into the container and "boot" all decoupled application logic (Observers, Events, Database defaults).

## Include
- **Model Observers**: Wiring models like `User` to their respective Observers.
- **Event Mapping**: Connecting system events (Login, Logout) to their Listeners.
- **Database Configuration**: Setting global schema defaults such as UUID morph keys and string lengths.
- **Service Registration**: Binding complex services or third-party integrations into the Laravel Container.

## Do NOT Include
- **Business Logic**: Never write "if/else" business rules here; call a service instead.
- **Routing**: Keep route definitions in `routes/*.php` or `bootstrap/app.php`.

---

## Standard Implementation: AppServiceProvider

In **AuthPanel**, we utilize the `boot` method to initialize the security and auditing perimeter.

### Implementation Guide

- **Schema Tuning**: Force UUID as the default morph key type to align with our security-first database architecture.
- **Observer Activation**: Register the `UserObserver` here to ensure account security events are captured globally.
- **Event Discovery**: Use the functional `Event::listen` approach to connect authentication lifecycle events to logging listeners.

### Example Configuration

```php
public function boot(): void
{
    // 1. Database Defaults
    Schema::defaultStringLength(191);
    Schema::defaultMorphKeyType('uuid');

    // 2. Register Model Observers
    User::observe(UserObserver::class);

    // 3. Map Events to Listeners
    Event::listen(Login::class, LogSuccessfulLogin::class);
    Event::listen(Logout::class, LogSuccessfulLogout::class);
    Event::listen(PasswordReset::class, LogResetPassword::class);
}
```

---

## Best Practices

- **Keep Boot Clean**: If the `boot` method becomes too large, create specialized providers (e.g., `EventServiceProvider`, `ObserverServiceProvider`).
- **Avoid Database Queries**: Do not run queries inside a Provider; only use them for configuration and registration.
- **Order of Operations**: Set Schema defaults at the very top of the `boot` method to avoid migration or relationship conflicts.

---

## Directory Structure

Providers/
├─ AppServiceProvider.php      # Main provider for bootstrapping and wiring
└─ docs/
    ├─ doc.md
    └─ providers.md             # Implementation guide and code samples

---

Check: [Providers Implementation Guide](./providers.md)