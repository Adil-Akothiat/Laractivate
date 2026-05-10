# Controllers

## Purpose: 
- he entry point. Handles HTTP requests and returns responses.

## Include:
- **Validation Trigger**: Utilizing `FormRequests` to ensure data integrity.
- **Service Delegation**: Calling a single Service method to perform business logic.
- **Response Transformation**: Returning Resources or structured JSON.
- **Exception Handling**: Using `try/catch` blocks for specific business or security exceptions.

## Do NOT Include:
- **Database Queries**: No direct Eloquent calls (e.g., `User::all()`).
- **Complex Logic**: No deep `if/else` chains regarding business rules.
- **Infrastructure Tasks**: Do not send emails or handle notifications directly.

## Directory Structure
Controllers/
├─ Api/
│  ├─ Access/
│  │  └─ RbacController.php
│  ├─ Auth/
│  │  ├─ AuthController.php
│  │  ├─ PasswordController.php
│  │  ├─ RegisterController.php
│  │  └─ TwoFactorAuthController.php
│  ├─ System/
│  │  ├─ ActivityLogsController.php
│  │  ├─ DashboardController.php
│  │  └─ NotificationsController.php
│  └─ User/
│     ├─ AccountsController.php
│     ├─ ProfileController.php
│     └─ SecurityController.php
├─ docs/
└─ Controller.php

Check:[Controllers Guide Implementation](./controllers.md)
Check:[Auth Lifecycle Guide](./authLifeCycle.md)