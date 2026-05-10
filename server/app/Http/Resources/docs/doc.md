## Best Practices
*   **Eager Loading Check**: Only access relationships (like `$this->roles`) if you have eager-loaded them in the Service/Controller to avoid "N+1" query issues.
*   Following the split-documentation strategy you've established, here is the documentation for the **Resources** layer. This layer acts as the "Output Filter," ensuring your API responses are clean, consistent, and secure.

---

### 1. Main Directory Documentation: `app/Http/Resources/docs/doc.md`

# Resources (Data Transformation)

## Purpose: 
- The "Output Filter." Transforms Eloquent models and collections into a consistent, front-end-ready JSON structure.

## Include:
- **Data Mapping**: Renaming database columns to camelCase or user-friendly keys.
- **Relationship Loading**: Including related data (e.g., a user’s roles) only when necessary.
- **Computed Fields**: Adding virtual fields like `full_name` or `permissionsSet` that don't exist in the database.
- **Security Stripping**: Ensuring sensitive data (like password hashes or internal IDs) is never leaked.

## Do NOT Include:
- **Business Logic**: Do not perform complex calculations or state changes here.
- **Database Queries**: Never trigger new queries inside a resource; use eager loading in the Controller/Service instead.

## Directory Structure
Resources/
├─ AccountResource.php
├─ PermissionCollection.php
├─ PermissionResource.php
├─ SessionResource.php
├─ UserResource.php
└─ WithPaginationMeta.php

Check: [Resources Guide Implementation](./resources.md)