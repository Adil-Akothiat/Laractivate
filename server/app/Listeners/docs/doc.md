# Listeners

## Purpose:
- **Decoupled Side Effects**: Handles secondary actions that occur after a specific event, ensuring the core application flow remains focused and fast.

## Include:
- **Logging & Auditing**: Recording login sessions, password changes, or logout events.
- **Notification Triggers**: Sending "Welcome" emails or 2FA alerts after successful registration/login.
- **Data Cleanup**: Removing temporary files or expired records after an associated process completes.

## Do NOT Include:
- **Primary Logic**: The main task (e.g., creating a user or updating a password) must be finished before the listener runs.
- **Blocking Operations**: Avoid heavy synchronous logic that delays the HTTP response; use `ShouldQueue` for time-consuming tasks.

## Directory Structure
Listeners/
├─ LogResetPassword.php
├─ LogSuccessfulLogin.php
├─ LogSuccessfulLogout.php
└─ docs/
   └─ doc.md

Check: [Listeners Guide Implementation](./listeners.md)