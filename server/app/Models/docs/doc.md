# Models

## Purpose
The blueprint. Represents the data structure and relationships of the application. Models provide a fluent interface for interacting with the database.

## Include
- **Mass Assignment Protection** — Defining `$fillable` or `$guarded` attributes on every model.
- **Casts** — Ensuring data types like booleans, dates, and JSON are handled correctly.
- **Relationships** — Defining how models connect (e.g., `User` has many `RefreshTokens`).
- **State Helpers** — Lightweight methods that answer questions about the model's state (e.g., `hasPermission()`).

## Do NOT Include
- **Validation** — Keep all validation rules inside Request classes.
- **Complex Business Flow** — If a task spans multiple models or steps, move it to a Service.

## Directory Structure

```
Models/
├─ ActivityLog.php        ← history of user actions
├─ Permission.php         ← granular access strings
├─ RefreshToken.php       ← stateful JWT management
├─ Role.php               ← user groupings (Admin, Editor, etc.)
├─ User.php               ← core authentication model
└─ docs/
   ├─ doc.md
   └─ auth_diagram_models.pdf
```

## Docker Commands

```bash
# Model only
docker-compose exec app php artisan make:model Role

# Model + migration
docker-compose exec app php artisan make:model Role -m

# Model + migration + factory + seeder in one shot
docker-compose exec app php artisan make:model Role -mfs

# Model + migration + factory + seeder + resource controller
docker-compose exec app php artisan make:model Role -mfsc
```

> Every model in this project should define `$fillable` and `$casts` explicitly:
>
> ```php
> protected $fillable = [
>     'name',
>     'email',
>     'two_factor_enabled',
> ];
>
> protected $casts = [
>     'two_factor_enabled' => 'boolean',
>     'email_verified_at'  => 'datetime',
> ];
> ```

## Further Reading
- [Models Implementation Guide](./models.md)
- [Auth Models Diagram](./auth_diagram_models.pdf)