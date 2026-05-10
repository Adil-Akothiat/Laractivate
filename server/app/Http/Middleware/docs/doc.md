# Middleware

## Purpose: 
The gatekeepers of the application. Middleware acts as a series of filters that every request must pass through before reaching the Controller.


## Include:
- **Authentication & Authorization**: Verifying JWTs and checking User Permissions.
- **Request Preparation**: Extracting tokens from cookies or modifying headers.
- **Security Checks**: Verifying if a session or token has been revoked in the database.
- **Sanitization**: Stripping tags or trimming strings from incoming data.

## Do NOT Include:
- **Database State Changes**: Use Services or Observers for logging or data updates.
- **Business Logic**: Rules like "Calculate tax" belong in Services, not here.

## Directory Structure
Middleware/
├─ docs/
│  ├─ doc.md
│  └─ middlewares.md
├─ JwtFromCookie.php
├─ PermissionMiddleware.php
└─ TokenRevocationMiddleware.php

## Pro-Tip for AuthPanel V1:
To keep your `routes/api.php` clean, you should register these in `bootstrap/app.php` using descriptive aliases like `permission`, and `check.revocation`.

Check: [Middleware Guide Impementation](./middlewares.md)
Check: [Middleware Registration Guide](../../../../bootstrap/docs/doc.md)