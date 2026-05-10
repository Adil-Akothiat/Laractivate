# Services Implementation Guide

This file contains implementation details, code samples, and advanced usage patterns for Services in the AuthPanel project.

---

## Example: Service Method

```php
public function revoke(User $user, string $sessionId): bool 
{
    $session = $this->sessionRepository->find($sessionId);

    if ($session->user_id !== $user->id) {
        throw new UnauthorizedException("You cannot revoke a session you do not own.");
    }

    return $session->delete();
}
```

---

## Dependency Injection Example

```php
public function __construct(
    protected AuthService $auth
) {}
```

---

## Advanced Patterns
- **Result Objects**: Return custom result objects for complex operations.
- **Service Composition**: Compose multiple services for advanced workflows.

---

## References
- See [doc.md](./doc.md) for high-level purpose, best practices, and directory structure.
