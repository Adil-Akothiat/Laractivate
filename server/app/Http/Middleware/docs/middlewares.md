# Middlewares

## Standard Middleware Definitions
1. `JwtFromCookie.php`
Since AuthPanel stores tokens in HttpOnly Cookies to prevent XSS attacks, this middleware is responsible for grabbing the `access_token` from the cookie and injecting it into the Request header so Laravel's authentication system can process it normally.

2. `TokenRevocationMiddleware.php`
This is the **Stateful Security layer**. Even if a JWT is technically valid (not expired), this middleware checks the database to ensure the session has not been revoked (e.g., the user logged out from all devices or an admin locked the account).

3. `PermissionMiddleware.php`
The **RBAC (Role-Based Access Control)** gate. It checks the authenticated user's permissions against the required permission for the specific route.

## Standard Implementation Pattern
Middleware should remain focused on a single responsibility. If a check fails, the middleware should return an immediate, clear JSON response.

### Example: Revocation Check
```php
public function handle(Request $request, Closure $next)
{
    // 1. Check if the session exists and is active in DB
    if ($this->authService->isSessionRevoked($request->user())) {
        
        // 2. Clear cookies and block access
        return response()->json(['message' => 'Session expired or revoked.'], 401)
            ->withoutCookie('access_token');
    }

    return $next($request);
}
```