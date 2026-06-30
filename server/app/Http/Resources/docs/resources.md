# Resources Guide

## Standard Implementation Pattern
Resources in **AuthPanel** act as a contract between the Backend and the Frontend. They guarantee that even if the database schema changes, the JSON response remains stable.

1. **The Transformation**
The `toArray()` method defines exactly what the frontend receives. This is where we flatten deep relationships or format dates.

2. **Handling Collections vs. Single Items**
    - Use **JsonResource** for single objects (e.g., `UserResource`).
    - Use **ResourceCollection** for lists of data (e.g., `PermissionCollection`) to add metadata   like total counts.

### Example: `UserResource`

```php
class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                 => $this->id,
            'full_name'          => $this->first_name . ' ' . $this->last_name,
            'email'              => $this->email,
            'is_active'          => $this->is_active,
            // Computed role and permission sets for the Frontend
            'rolesSet'           => $this->roles->pluck('name'),
            'permissionsSet'     => $this->roles->flatMap(fn($role) => $role->permissions->pluck('name')),
            // Contextual logic
            'is_current_user'    => $this->id === auth()->id(),
        ];
    }
}
```

## Best Practices
- **Eager Loading Check**: Only access relationships (like `$this->roles`) if you have eager-loaded them in the Service/Controller to avoid "N+1" query issues.
- **Conditional Attributes**: Use `$this->when()` to conditionally include fields based on permissions or if the data was actually loaded.
- **Pagination Consistency**: Utilize the `WithPaginationMeta` trait to ensure all paginated responses include standardized `meta` and `links` objects for the React/Next.js frontend.


## A Note on your `WithPaginationMeta.php`
Since you are using this trait in your `RbacController`, it's a great "Professional Touch" to document it as the standard for any list-based API response in **AuthPanel**. It ensures the frontend grid always knows exactly how many pages exist.