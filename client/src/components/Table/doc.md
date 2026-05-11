# DataTable

## Purpose
A generic, type-safe table built on DaisyUI's table primitives. Handles loading states, empty states, row actions with permission gating, and row click navigation — all through a single `columns` + `data` config.

## Basic Usage

```tsx
import DataTable from '@/components/Table/DataTable';

const columns = [
    { key: 'name',  header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role',  header: 'Role' },
];

<DataTable
    columns={columns}
    data={users}
    keyExtractor={(row) => row.id}
/>
```

---

## Custom Cell Rendering

Use `render` on any column to take full control of the cell output:

```tsx
const columns = [
    {
        key: 'name',
        header: 'Name',
        render: (row) => (
            <div className="flex items-center gap-2">
                <Avatar src={row.avatar} size="sm" />
                <span>{row.name}</span>
            </div>
        ),
    },
    {
        key: 'status',
        header: 'Status',
        render: (row) => (
            <Badge variant={row.active ? 'success' : 'ghost'}>
                {row.active ? 'Active' : 'Inactive'}
            </Badge>
        ),
    },
];
```

---

## Loading State

Pass `loading` to show a skeleton or spinner while data is fetching:

```tsx
// Centered spinner (default when skeletonRows is omitted)
<DataTable columns={columns} data={[]} loading={isLoading} keyExtractor={(row) => row.id} />

// Skeleton rows (matches the table shape — better UX)
<DataTable
    columns={columns}
    data={[]}
    loading={isLoading}
    skeletonRows={5}
    keyExtractor={(row) => row.id}
/>
```

---

## Row Click Navigation

```tsx
<DataTable
    columns={columns}
    data={users}
    keyExtractor={(row) => row.id}
    onRowClick={(row) => navigate(`/accounts/${row.id}`)}
/>
```

> Rows automatically get `cursor-pointer` and hover styling when `onRowClick` is set.

---

## Row Actions

Actions render as a `⋮` dropdown in the last column. Each action supports navigation (`href`), in-page handlers (`onClick`), permission gating (`permission`), and conditional hiding (`hidden`).

```tsx
const actions = [
    {
        label: 'View',
        href: (row) => `/accounts/${row.id}`,
    },
    {
        label: 'Edit',
        href: (row) => `/accounts/${row.id}/edit`,
        permission: 'accounts.manage',       // hidden if user lacks permission
    },
    {
        label: 'Delete',
        className: 'text-error',
        permission: 'accounts.manage',
        hidden: (row) => row.id === currentUser.id,  // hide for own account
        onClick: (row) => handleDelete(row.id),
    },
];

<DataTable
    columns={columns}
    data={users}
    keyExtractor={(row) => row.id}
    actions={actions}
/>
```

> When a user lacks the required `permission`, the action is rendered as disabled (via `blocked-element` class) rather than hidden — so the UI stays consistent in shape.

---

## Table Styling Props

These map directly to DaisyUI table modifiers:

```tsx
<DataTable
    columns={columns}
    data={users}
    keyExtractor={(row) => row.id}
    zebra        // alternating row background
    compact      // table-xs — tighter row height
    pinRows      // sticky header
    pinCols      // sticky first column
    className="border border-base-200 rounded-lg"
/>
```

---

## Empty State

```tsx
<DataTable
    columns={columns}
    data={[]}
    keyExtractor={(row) => row.id}
    emptyMessage="No users found. Try adjusting your filters."
/>
```

---

## Props

### DataTable

| Prop | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `columns` | `Column<T>[]` | Yes | — | Column definitions |
| `data` | `T[]` | Yes | — | Row data array |
| `keyExtractor` | `(row, index) => string \| number` | Yes | — | Unique key per row |
| `loading` | `boolean` | No | `false` | Show loading state |
| `skeletonRows` | `number` | No | — | Skeleton row count — spinner shown if omitted |
| `emptyMessage` | `string` | No | `"No data available."` | Message when data is empty |
| `onRowClick` | `(row: T) => void` | No | — | Row click handler |
| `actions` | `Action<T>[]` | No | — | Row-level dropdown actions |
| `zebra` | `boolean` | No | `false` | Alternating row colors |
| `compact` | `boolean` | No | `false` | Compact row height |
| `pinRows` | `boolean` | No | `false` | Sticky header row |
| `pinCols` | `boolean` | No | `false` | Sticky first column |
| `className` | `string` | No | — | Extra classes on `<table>` |

### Column

| Prop | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `key` | `keyof T \| string` | Yes | Data key or unique identifier |
| `header` | `string` | Yes | Column header label |
| `render` | `(row, index) => ReactNode` | No | Custom cell renderer — overrides default key lookup |
| `className` | `string` | No | Classes on each `<td>` |
| `headerClassName` | `string` | No | Classes on `<th>` |

### Action

| Prop | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `label` | `string` | Yes | Dropdown item text |
| `href` | `string \| (row) => string` | No | Navigate to URL — use instead of `onClick` for links |
| `onClick` | `(row: T) => void` | No | In-page handler — only used when `href` is not set |
| `permission` | `string` | No | Gates action behind a `Can` permission check |
| `hidden` | `(row: T) => boolean` | No | Return `true` to hide the action for a specific row |
| `className` | `string` | No | Classes on the action item (e.g. `text-error` for destructive) |

---

## Notes

- The table is wrapped in `overflow-x-auto` with `max-h-[calc(100vh-300px)]` — it scrolls both horizontally and vertically within the viewport
- The `⋮` dropdown auto-flips upward (`dropdown-top`) when there is less than 160px of space below the button, and always flips for the last row
- Actions dropdown closes on outside click and on scroll
- `onRowClick` and action `onClick` are isolated — clicking an action does not trigger `onRowClick`

## Related
- [`Can`](../Guard/doc.md) — permission gating used internally by actions
- [`SkeletonLoader`](../Loaders.tsx) — used for `skeletonRows` loading state
- [`appPermissions`](../../app/constants/appPermissions.ts) — available permission strings for action gating