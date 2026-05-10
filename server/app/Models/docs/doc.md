# Models

## Purpose: 
- **The Blueprint**: Represents the data structure and business rules of the application. Models handle data relationships and provide a fluent interface for interacting with the database.

## Include:
- **Mass Assignment Protection**: Defining `$fillable` or `$guarded` attributes.
- **Casts**: Ensuring data types (like booleans or dates) are handled correctly.
- **Relationships**: Defining how models connect (e.g., `User` has many `RefreshTokens`).
- **Custom Logic**: Helper methods that provide quick answers about the model's state (e.g., `hasPermission`).

## Do NOT Include:
- **Validation**: Keep validation in **Requests**.
- **Complex Business Flow**: If a task involves multiple models and steps, move it to a **Service**.

## Directory Structure
Models/
├─ ActivityLog.php       # History of user actions
├─ Permission.php        # Granular access strings
├─ RefreshToken.php      # Stateful JWT management
├─ Role.php              # User groupings (Admin, Editor, etc.)
├─ User.php              # Core authentication model
└─ docs/
   ├─ auth_diagram_models.pdf
   └─ doc.md

Check:[Models Guide Implementation](./models.md)