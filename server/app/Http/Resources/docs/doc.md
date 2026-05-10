# Resources (Data Transformation)

## Purpose
The output filter. Transforms Eloquent models and collections into a consistent, frontend-ready JSON structure.

## Include
- **Data Mapping** — Renaming database columns to camelCase or user-friendly keys.
- **Relationship Loading** — Including related data (e.g., a user's roles) only when already eager-loaded.
- **Computed Fields** — Adding virtual fields like `full_name` or `permissionsSet` that don't exist in the database.
- **Security Stripping** — Ensuring sensitive fields (e.g., password hashes, internal IDs) are never exposed.

## Do NOT Include
- **Business Logic** — No complex calculations or state changes inside a resource.
- **Database Queries** — Never trigger new queries inside a resource. Always eager-load in the Controller or Service to avoid N+1 issues.

## Directory Structure

```
Resources/
├─ AccountResource.php
├─ PermissionCollection.php
├─ PermissionResource.php
├─ SessionResource.php
├─ UserResource.php
├─ WithPaginationMeta.php
└─ docs/
   ├─ doc.md
   └─ resources.md
```

## Docker Commands

```bash
# Single resource
docker-compose exec app php artisan make:resource UserResource

# Collection resource
docker-compose exec app php artisan make:resource PermissionCollection --collection
```

> Only access relationships inside a resource if they were eager-loaded upstream:
>
> ```php
> // In your Service or Controller — load first
> $user = User::with('roles', 'permissions')->findOrFail($id);
>
> // In your Resource — safe to access
> 'roles' => RoleResource::collection($this->whenLoaded('roles')),
> ```
>
> Use `whenLoaded()` to conditionally include relationships — it returns `null` instead of triggering a query if the relation wasn't loaded.

## Further Reading
- [Resources Implementation Guide](./resources.md)