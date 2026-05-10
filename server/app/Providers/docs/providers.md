# Providers Implementation Guide

This file contains implementation details, code samples, and advanced usage patterns for Service Providers in the AuthPanel project.

---

## Example: AppServiceProvider

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

## Advanced Patterns

- **Specialized Providers**: For large projects, split event and observer registration into `EventServiceProvider` and `ObserverServiceProvider`.
- **Third-Party Integration**: Register external services in the `register()` method for better testability and separation of concerns.
