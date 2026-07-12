# Bootstrap Implementation Guide

This file contains implementation details, code samples, and advanced usage patterns for the application bootstrap process in AuthPanel.

---

## Middleware Pipeline Example

```php
// In bootstrap/app.php
$app->middleware([
    // ...
    \App\Http\Middleware\JwtFromCookie::class,
    // ...
]);
```

---

## Exception Handling Example

```php
// In app/Exceptions/ApiExceptionHandler.php
public function render($request, Throwable $exception)
{
    // Custom logic for JSON error responses
}
```

---

## References
- See [doc.md](./doc.md) for high-level purpose, best practices, and directory structure.
