# Middleware

## Purpose
The gatekeepers of the application. Acts as a series of filters every request must pass through before reaching a Controller.

## Include
- **Authentication & Authorization** — Verifying JWTs and checking user permissions.
- **Request Preparation** — Extracting tokens from cookies or modifying headers.
- **Security Checks** — Verifying if a session or token has been revoked in the database.
- **Sanitization** — Stripping tags or trimming strings from incoming request data.

## Do NOT Include
- **Database State Changes** — Use Services or Observers for logging or data updates.
- **Business Logic** — Rules like "calculate tax" belong in Services, not here.

## Directory Structure

```
Middleware/
├─ JwtFromCookie.php
├─ PermissionMiddleware.php
├─ TokenRevocationMiddleware.php
└─ docs/
   ├─ doc.md
   └─ middlewares.md
```

## Docker Commands

```bash
# Create a new middleware
docker-compose exec app php artisan make:middleware JwtFromCookie
docker-compose exec app php artisan make:middleware PermissionMiddleware
docker-compose exec app php artisan make:middleware TokenRevocationMiddleware
```

> After creating, register middleware aliases in `bootstrap/app.php` — not in `routes/api.php` — to keep routes clean:
>
> ```php
> ->withMiddleware(function (Middleware $middleware) {
>     $middleware->alias([
>         'permission'       => \App\Http\Middleware\PermissionMiddleware::class,
>         'check.revocation' => \App\Http\Middleware\TokenRevocationMiddleware::class,
>     ]);
> })
> ```

## Further Reading
- [Middleware Implementation Guide](./middlewares.md)
- [Middleware Registration Guide](../../../../bootstrap/docs/doc.md)