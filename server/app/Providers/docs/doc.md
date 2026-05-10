# Providers

## Purpose
The central connection hub. Binds classes into the container and boots all decoupled application logic — observers, events, and database defaults.

## Include
- **Model Observers** — Wiring models like `User` to their respective observers.
- **Event Mapping** — Connecting system events (Login, Logout) to their listeners.
- **Database Configuration** — Setting global schema defaults such as UUID morph keys and string lengths.
- **Service Registration** — Binding complex services or third-party integrations into the Laravel container.

## Do NOT Include
- **Business Logic** — No `if/else` rules here. Call a service instead.
- **Database Queries** — Providers are for configuration and registration only, never data retrieval.
- **Routing** — Keep route definitions in `routes/*.php` or `bootstrap/app.php`.

## Directory Structure

```
Providers/
├─ AppServiceProvider.php     ← main provider for bootstrapping and wiring
└─ docs/
   ├─ doc.md
   └─ providers.md
```

## Docker Commands

```bash
# Create a new service provider
docker-compose exec app php artisan make:provider EventServiceProvider
docker-compose exec app php artisan make:provider ObserverServiceProvider
```

> The standard `AppServiceProvider::boot()` wires the entire security and auditing perimeter in one place. Follow this order — schema defaults first, then observers, then events:
>
> ```php
> public function boot(): void
> {
>     // 1. Database defaults — always first to avoid migration conflicts
>     Schema::defaultStringLength(191);
>     Schema::defaultMorphKeyType('uuid');
>
>     // 2. Model observers
>     User::observe(UserObserver::class);
>
>     // 3. Event → Listener mapping
>     Event::listen(Login::class, LogSuccessfulLogin::class);
>     Event::listen(Logout::class, LogSuccessfulLogout::class);
>     Event::listen(PasswordReset::class, LogResetPassword::class);
> }
> ```
>
> If `boot()` grows too large, split into dedicated providers (e.g., `EventServiceProvider`, `ObserverServiceProvider`) rather than leaving one bloated file.

## Further Reading
- [Providers Implementation Guide](./providers.md)