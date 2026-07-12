# Routes Implementation Guide

This file contains implementation details, code samples, and advanced usage patterns for the routing layer in AuthPanel.

---

## Example: API Route Group

```php
// In routes/api.php
Route::prefix('v1')->group(function () {
    require __DIR__.'/base_api/system/index.php';
    require __DIR__.'/base_api/user/index.php';
    // ...
});
```

---

## Example: Route Middleware

```php
Route::middleware(['auth:api', 'permission:admin'])
    ->get('/admin/dashboard', [AdminDashboardController::class, 'index']);
```

---

## References
- See [doc.md](./doc.md) for high-level purpose, best practices, and directory structure.
