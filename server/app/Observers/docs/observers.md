# Observers Guide

## Standard Implementation Pattern
In **AuthPanel**, we use Observers primarily to decouple **Security Notifications** and **Audit Logging** from our Business Logic.

1. **The `updated` Hook**
This is the most critical hook for security. We use Eloquent's `wasChanged()` and `getOriginal()` methods to detect exactly what the user updated and log the "before and after" state.
2. **Service Delegation**
While the Observer catches the event, it delegates the heavy lifting to the `SystemSupportService`. This keeps the Observer focused purely on the "Observation" and the Service focused on "Execution."

## Example: UserObserver
```php
public function updated(User $user): void
{
    // 1. Detect Password Changes
    if ($user->wasChanged('password')) {
        SystemSupportService::log('Changed password', 'auth.password_update', [], $user->id);
        
        $this->systemSupport->security(
            $user, 
            'Password changed!', 
            'Your password was successfully updated...'
        );
    }

    // 2. Audit Profile Changes (with Data Comparison)
    if ($user->wasChanged(['first_name', 'last_name'])) {
        SystemSupportService::log('Updated profile', 'profile.update', [
            'old' => array_intersect_key($user->getOriginal(), array_flip(['first_name', 'last_name'])),
            'new' => $user->only(['first_name', 'last_name'])
        ], $user->id);
    }
}
```
## Best Practices

- **Dirty Checking**: Always use `wasChanged()` to ensure logic only runs when specific, relevant data is modified.
- **Mass Updates**: Be aware that Eloquent's `update()` (on a query builder) and `delete()` (on a query builder) `do not` trigger observers. Observers only fire when models are retrieved and then saved/deleted individually.
- **Constructor Injection**: Inject your support services via the constructor to maintain the "Inject → Delegate" pattern used throughout **AuthPanel**.

## Final Integration Note
To ensure these observers are active in **Laravel 12**, make sure you register them in your `AppServiceProvider` using the `User::observe(UserObserver::class)` syntax in the `boot` method.