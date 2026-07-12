# Database

## Purpose
The persistence layer. Manages the structure, seeding, and test data generation for the entire application database.

## Include
- **Migrations** — Defining and versioning the database schema (tables, columns, indexes, foreign keys).
- **Seeders** — Populating the database with default or demo data for development and production bootstrapping.
- **Factories** — Generating realistic fake model instances for testing and local development.

## Do NOT Include
- **Business Logic** — No conditionals or calculations inside migrations or seeders.
- **Direct Model Queries in Migrations** — Use raw `DB::` statements in migrations, not Eloquent models. Models can change over time and break old migrations.

## Directory Structure

```
database/
├─ migrations/          ← versioned schema changes
├─ seeders/             ← default and demo data
├─ factories/           ← fake model generation for dev/testing
└─ docs/
   ├─ doc.md
   └─ database.md
```

## Docker Commands

```bash
# Migrations
docker-compose exec app php artisan make:migration create_roles_table
docker-compose exec app php artisan make:migration add_two_factor_to_users_table

# Seeders
docker-compose exec app php artisan make:seeder RoleSeeder
docker-compose exec app php artisan make:seeder PermissionSeeder

# Factories
docker-compose exec app php artisan make:factory UserFactory --model=User

# Running migrations
docker-compose exec app php artisan migrate                   # run pending migrations
docker-compose exec app php artisan migrate:fresh --seed      # full reset + seed
docker-compose exec app php artisan migrate:rollback          # undo last batch
docker-compose exec app php artisan migrate:status            # check what has run

# Running seeders
docker-compose exec app php artisan db:seed                   # run all seeders
docker-compose exec app php artisan db:seed --class=RoleSeeder  # run one seeder
```

> Never use Eloquent models inside a migration — use raw `DB::` statements instead:
>
> ```php
> // Wrong — model may not match schema at migration time
> User::create([...]);
>
> // Correct
> DB::table('users')->insert([...]);
> ```

## Further Reading
- [Database Implementation Guide](./database.md)