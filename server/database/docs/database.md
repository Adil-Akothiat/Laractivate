# Database Implementation Guide

This file contains implementation details, code samples, and advanced usage patterns for the database layer in AuthPanel.

---

## Migration Example

```php
// In database/migrations/0001_01_01_000000_create_users_table.php
Schema::create('users', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('email')->unique();
    // ...
});
```

---

## Seeder Example

```php
// In database/seeders/UserSeeder.php
User::factory()->count(10)->create();
```

---

## References
- See [readme.md](./doc.md) for high-level purpose, best practices, and directory structure.
