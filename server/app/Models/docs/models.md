# Models Guide

## The Core: User Model
The `User` model in AuthPanel is an extension of Laravel’s `Authenticatable` and implements the `JWTSubject` contract. It serves as the central hub for identity and access management.

### Key Features
1. **UUID Support**: Uses non-incrementing string keys for IDs to improve security and prevent ID enumeration.
2. **JWT Custom Claims**: Automatically injects a user's roles into the JWT payload, allowing the frontend to read roles without extra API calls.
3. **RBAC Integration**: Provides a `hasPermission()` method that checks through relationships to see if any of the user's roles contain a specific permission.

## Implementation Example: Permission Check
The `hasPermission` method is a clean way to check access anywhere in the application:

```php
public function hasPermission(string $permission): bool
{
    return $this->roles()->whereHas('permissions', function(Builder $query) use ($permission) {
        $query->where('name', $permission);
    })->exists();
}
```

## Relationships Pattern
We use standard Eloquent relationships to ensure the data stays decoupled yet accessible:
- **Authentication**: `refreshTokens()` tracks active device sessions for stateful revocation.
- **Security**: `roles()` uses a BelongsToMany relationship, allowing a user to have multiple roles.
- **Audit**: `activityLogs()` provides a direct link to the user's history.

## Best Practices
- **Hidden Fields**: Always include sensitive data like `password` in the `$hidden` array to prevent accidental exposure in API responses.
- **Soft Deletes**: Use `SoftDeletes` for the User model so that activity logs and history aren't orphaned if an account is removed.
- **Type Safety**: Use the `casts()` method to ensure attributes like `is_active` always return as Booleans.