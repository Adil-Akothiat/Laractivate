# Pagination

## Purpose
A controlled pagination bar with smart page truncation, a results range summary, and prev/next navigation. Returns `null` automatically when there is only one page — no conditional rendering needed in the parent.

## Basic Usage

```tsx
import Pagination from '@/components/Pagination';

<Pagination
    currentPage={page}
    totalPages={data.last_page}
    total={data.total}
    perPage={data.per_page}
    onPageChange={(p) => setPage(p)}
/>
```

---

## With React Query + Laravel Pagination

Laravel's paginated responses map directly to the props:

```tsx
const [page, setPage] = useState(1);

const { data } = useQuery({
    queryKey: ['users', page],
    queryFn: () => api.get(`/users?page=${page}`),
});

<DataTable
    columns={columns}
    data={data.data}
    keyExtractor={(row) => row.id}
    loading={isLoading}
/>

<Pagination
    currentPage={data.current_page}
    totalPages={data.last_page}
    total={data.total}
    perPage={data.per_page}
    onPageChange={setPage}
/>
```

---

## Size Variants

```tsx
<Pagination ... size="xs" />
<Pagination ... size="sm" />  {/* default */}
<Pagination ... size="md" />
```

---

## Page Truncation Behavior

The component generates a smart page range to avoid overflowing on large datasets:

| Total pages | Current page | Renders |
| :--- | :--- | :--- |
| ≤ 5 | any | All pages |
| > 5 | 1–3 | `1 2 3 … N` |
| > 5 | near end | `1 … N-2 N-1 N` |
| > 5 | middle | `1 … P-1 P P+1 … N` |

---

## Props

| Prop | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `currentPage` | `number` | Yes | — | Active page number (1-indexed) |
| `totalPages` | `number` | Yes | — | Total number of pages |
| `total` | `number` | Yes | — | Total record count (for range summary) |
| `perPage` | `number` | Yes | — | Records per page (for range summary) |
| `onPageChange` | `(page: number) => void` | Yes | — | Called with the new page number |
| `size` | `"xs" \| "sm" \| "md"` | No | `"sm"` | Button size |
| `className` | `string` | No | — | Extra classes on the wrapper |

---

## Notes

- Returns `null` when `totalPages <= 1` — no need to wrap it in a conditional
- The results summary on the left (e.g. `1–20 of 143`) is always visible when the component renders
- `onPageChange` is the only source of truth — the component is fully controlled and holds no internal page state
- The `‹` and `›` buttons are disabled at the boundaries — no out-of-range calls

## Related
- [`DataTable`](../Table/doc.md) — typically rendered directly below a DataTable