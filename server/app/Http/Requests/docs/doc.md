# Requests (Validation)

## Purpose:
The "**Security Gate.**" Ensures that all incoming data is clean, correctly typed, and authorized before reaching the Controller.

## Include:
- **Validation Rules**: Defining field constraints (e.g., `email`, `exists`, `min:8`).
- **Authorization Logic**: Checking if the user has permission to perform the specific action via the `authorize()` method.
- **Custom Attributes**: Friendly naming for fields in error messages.

## Do NOT Include:
- **Business Logic**: Never perform calculations or database updates here.
- **Database Persistence**: Do not save models inside a Request class.

## Directory Structure
Requests/
├─ ForgotPasswordRequest.php
├─ LoginRequest.php
├─ RegisterRequest.php
├─ ResetPasswordRequest.php
├─ RoleRequest.php
└─ StoreUserRequest.php

Check: [Requests Guide Implementation](./requests.md)