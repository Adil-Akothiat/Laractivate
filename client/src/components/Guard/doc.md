# Can

## Purpose
Conditionally renders UI based on the current user's permissions. The declarative alternative to `useCan()` — use it directly in JSX instead of writing `if` blocks.

## Usage

### Single permission
```tsx
<Can permission="accounts.manage">
    <DeleteButton />
</Can>
```

### Multiple permissions (any match grants access)
```tsx
<Can permission={["all", "accounts.manage"]}>
    <EditButton />
</Can>
```

### With fallback
```tsx
<Can permission="roles.manage" fallback={<p>Access restricted.</p>}>
    <AccessControlPage />
</Can>
```

### Inline conditional rendering
```tsx
<Can permission="dashboard.view">
    <StatCard title="Total Users" value={stats.users} />
</Can>
```

## Props

| Prop | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `permission` | `string \| string[]` | Yes | — | Single permission string or array of permissions |
| `children` | `ReactNode` | Yes | — | Content to render when access is granted |
| `fallback` | `ReactNode` | No | `null` | Content to render when access is denied |

## How it works

- **Single string** → calls `can(permission)` — user must have that exact permission
- **Array** → calls `canAny(permission)` — user needs at least one match
- Permission `"all"` grants access to any role that has full access

## When to use `Can` vs `PermissionGuard`

| | `Can` | `PermissionGuard` |
| :--- | :--- | :--- |
| **Use for** | Hiding/showing UI elements | Protecting entire routes |
| **Lives in** | Component JSX | `routes/base/index.tsx` |
| **On deny** | Renders fallback or nothing | Redirects to `/403` |

## Related
- [`useCan`](../../app/middlewares/hooks/useCan.ts) — the underlying hook if you need permission checks in logic rather than JSX
- [`PermissionGuard`](../../app/middlewares/PermissionGuard.tsx) — route-level protection
- [`appPermissions`](../../app/constants/appPermissions.ts) — all available permission strings