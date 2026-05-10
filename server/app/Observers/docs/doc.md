# Observers

## Best Practices
*   **Dirty Checking**: Always use `wasChanged()` to ensure logic only runs when specific, relevant data is modified.
*   **Mass Updates**: Be aware that Eloquent's `update()` (on a query builder) and `delete()` (on a query builder) **do not** trigger observers. Observers only fire when models are retrieved and then saved/deleted individually.
*   **Constructor Injection**: Inject your support services via the constructor to maintain the "Inject → Delegate" pattern used throughout **AuthPanel**.

---

### Final Integration Note
To ensure these observers are active in **Laravel 12**, make sure you register them in your `AppServiceProvider` using the `User::observe(UserObserver::class)` syntax in the `boot` method.

**With this, your backend documentation is virtually aThis documentation for **Observers** captures the "silent automation" that keeps **AuthPanel** secure and well-audited. By moving lifecycle side-effects into Observers, you ensure that even if a user is updated via the command line or a background job, the audit trail and notifications remain intact.

---

### 1. Main Directory Documentation: `app/Observers/docs/doc.md`

# Observers

## Purpose: 
- **Automated Lifecycle Management**: Automatically reacts to Model events (created, updated, deleted) to maintain data integrity and audit trails without polluting Services or Controllers.

## Include:
- **Audit Trails**: Logging specific field changes (e.g., password updates, profile shifts) to the `ActivityLog`.
- **Automated Side-Effects**: Triggering security notifications when critical account settings change.
- **Model Preparation**: Setting defaults or generating unique identifiers (like UUIDs) before a record is saved.
- **Cleanup**: Removing related files or flushing caches when a model is deleted.

## Do NOT Include:
- **HTTP Logic**: No redirects or session flashes; Observers can be triggered outside of a web request (e.g., via CLI).
- **Infinite Loops**: Avoid calling `$model->save()` inside the `updated()` or `saved()` methods without checking for specific changes, as this can re-trigger the observer.

## Directory Structure
Observers/
├─ UserObserver.php      # Monitors account security and profile changes
└─ docs/
   └─ doc.md

Check:[Observer Guide Implementation](./observers.md)