# Services

## Purpose: 
- The "Brain" of the application. Where the rules live.

## Include:
- Pure business logic (e.g., "Calculate tax," "Verify 2FA").
- Interacting with multiple Models to complete a task.
- Throwing custom Exceptions when a business rule is broken.

## Do NOT Include:
- request() helper or getting data from headers.
- Generating HTML or JSON responses.
- Directly redirecting the user.



Services/
├─ docs/
│  ├─ doc.md
│  └─ services.md
├─ Security/
│  ├─ AuthService.php
│  ├─ JwtService.php
│  ├─ PasswordService.php
│  ├─ RbacService.php
│  └─ RegistrationService.php
├─ System/
│  ├─ ActivityLogService.php
│  ├─ DashboardService.php
│  ├─ SessionService.php
│  └─ SystemSupportService.php
└─ User/
   └─ UserService.php

---

Check: [Services Implementation Guide](./services.md)