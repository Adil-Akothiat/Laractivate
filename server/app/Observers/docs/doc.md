# Observers

## Purpose
Silent automation. Automatically reacts to model events (created, updated, deleted) to maintain data integrity and audit trails without polluting Services or Controllers.

## Include
- **Audit Trails** — Logging specific field changes (e.g., password updates, profile edits) to the `ActivityLog`.
- **Automated Side-Effects** — Triggering security notifications when critical account settings change.
- **Model Preparation** — Setting defaults or generating unique identifiers (like UUIDs) before a record is saved.
- **Cleanup** — Removing related files or flushing caches when a model is deleted.

## Do NOT Include
- **HTTP Logic** — No redirects or session flashes. Observers can be triggered outside a web request (e.g., via CLI or queue workers).
- **Unconditional `save()` calls** — Never call `$model->save()` inside `updated()` or `saved()` without a `wasChanged()` check — it will re-trigger the observer and cause an infinite loop.

## Directory Structure

```
Observers/
├─ UserObserver.php     ← monitors account security and profile changes
└─ docs/
   ├─ doc.md
   └─ observers.md
```

## Docker Commands

```bash
# Create an observer bound to a model
docker-compose exec app php artisan make:observer UserObserver --model=User
```

> Register observers in `AppServiceProvider::boot()` — not in a controller or middleware:
>
> ```php
> public function boot(): void
> {
>     User::observe(UserObserver::class);
> }
> ```
>
> Use `wasChanged()` to guard logic so it only runs when relevant fields actually changed:
>
> ```php
> public function updated(User $user): void
> {
>     if ($user->wasChanged('password')) {
>         $user->notify(new PasswordChangedNotification());
>     }
> }
> ```
>
> Note: Eloquent's query builder `update()` and `delete()` do **not** trigger observers. Observers only fire when a model instance is retrieved and then saved or deleted individually.

## Further Reading
- [Observers Implementation Guide](./observers.md)