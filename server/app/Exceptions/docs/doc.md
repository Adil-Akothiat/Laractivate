# Exceptions

## Purpose
Translates internal system errors and business logic violations into standardized JSON responses for the frontend.

## Include
- **Global Exception Formatting** — Converting PHP exceptions into clean JSON payloads via `ApiExceptionHandler`.
- **Business Logic Exceptions** — Custom exception classes for domain-specific violations (e.g., `TwoFactorRequiredException`).
- **HTTP Status Mapping** — Mapping exception types to the correct HTTP status codes.
- **API Route Filtering** — Only intercept and format exceptions originating from `api/*` routes.

## Do NOT Include
- **Business Logic** — Exceptions are thrown signals, not processors. No queries or service calls inside exception classes.
- **Frontend Concerns** — No HTML responses or redirects. All output is JSON only.
- **Silent Catches** — Do not swallow exceptions without logging or re-throwing.

## The Centralized Handler Pattern

Instead of wrapping every controller in `try/catch`, exceptions bubble up to `bootstrap/app.php`, which delegates formatting to `ApiExceptionHandler`.

**Error lifecycle:**

```
Service throws Exception
        ↓
Laravel Handler catches it
        ↓
Checks if request is api/* route
        ↓
ApiExceptionHandler formats JSON response
        ↓
Frontend receives predictable payload
```

## Standard Response Schema

All error responses follow this structure so the React frontend can parse them predictably:

```json
{
    "code": "ERROR_SLUG",
    "message": "Human readable description",
    "errors": []
}
```

## Directory Structure

```
Exceptions/
├─ ApiExceptionHandler.php
├─ TwoFactorRequiredException.php
└─ docs/
   └─ doc.md
```

## Docker Commands

```bash
# Basic exception
docker-compose exec app php artisan make:exception TwoFactorRequiredException

# With HTTP response method (render)
docker-compose exec app php artisan make:exception TwoFactorRequiredException --render

# With logging method (report)
docker-compose exec app php artisan make:exception TwoFactorRequiredException --report

# With both
docker-compose exec app php artisan make:exception TwoFactorRequiredException --render --report
```