# Controllers

## Purpose
The entry point of the application. Handles incoming HTTP requests and returns structured responses.

## Include
- **Validation Trigger** — Utilizing `FormRequest` classes to ensure data integrity before processing.
- **Service Delegation** — Calling a single Service method to perform business logic.
- **Response Transformation** — Returning API Resources or structured JSON responses.
- **Exception Handling** — Using `try/catch` blocks for specific business or security exceptions.

## Do NOT Include
- **Database Queries** — No direct Eloquent calls (e.g., `User::all()`). That belongs in a Service.
- **Complex Logic** — No deep `if/else` chains or business rules.
- **Infrastructure Tasks** — Do not send emails or trigger notifications directly.

## Directory Structure

```
Controllers/
└─ Api/
   ├─ Access/
   │  └─ RbacController.php
   ├─ Auth/
   │  ├─ AuthController.php
   │  ├─ PasswordController.php
   │  ├─ RegisterController.php
   │  └─ TwoFactorAuthController.php
   ├─ System/
   │  ├─ ActivityLogController.php
   │  ├─ DashboardController.php
   │  └─ NotificationsController.php
   └─ User/
      ├─ AccountsController.php
      ├─ ProfileController.php
      └─ SecurityController.php
   └─ docs/
      ├─ authLifeCycle.md
      ├─ controllers.md
      └─ doc.md
└─ Controllers.php
```

## Docker Commands

```bash
# Basic controller
docker-compose exec app php artisan make:controller Api/Auth/AuthController

# API controller (recommended — no create/edit HTML methods)
docker-compose exec app php artisan make:controller Api/User/ProfileController --api

# Resource controller (index, store, show, update, destroy)
docker-compose exec app php artisan make:controller Api/User/ProfileController --resource
```

## Further Reading
- [Controllers Implementation Guide](./controllers.md)
- [Auth Lifecycle Guide](./authLifeCycle.md)