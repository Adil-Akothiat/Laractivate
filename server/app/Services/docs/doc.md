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
├─ Access/
│  └─ RbacService.php
├─ Auth/
│  ├─ AuthService.php
│  ├─ PasswordService.php
│  ├─ RegistrationService.php
│  └─ TwoFactorAuthService.php
├─ Jwt/
│  └─ JwtService.php
├─ System/
│  ├─ DashboardService.php
│  ├─ SessionService.php
│  └─ SystemSupportService.php
├─ User/
│  ├─ AccountService.php
│  └─ UserService.php
└─ docs/
│  ├─ doc.md
│  └─ services.md             # Implementation guide and code samples

---

Check: [Services Implementation Guide](./services.md)