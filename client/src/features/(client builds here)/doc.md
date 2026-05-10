# Features

## Structure

```
features/
├─ base/                  # built-in features — do not modify
│  ├─ auth/
│  ├─ rbac/
│  ├─ settings/
│  ├─ dashboard/
│  ├─ notifications/
│  └─ accounts/
├─ yourFeature/           # your features go here
└─ doc.md
```

---

## Base Features

The `base/` folder contains the features that ship with the boilerplate.
They are ready to use and should **not** be modified.

| Feature | Description |
|---|---|
| `auth` | Login, register, password reset, two-factor authentication |
| `rbac` | Roles and permissions management |
| `settings` | Profile, password, sessions, activity logs |
| `dashboard` | Personal and system dashboards |
| `notifications` | In-app notification bell and list |
| `accounts` | User management for super admin |

> If you need to extend a base feature, create a new feature that imports from it — do not edit it directly.
> This keeps your code upgrade-safe when new boilerplate versions are released.

---

## Adding a New Feature

Create a new folder at the `features/` level — not inside `base/`.

```
features/
├─ base/
└─ billing/               # your new feature example
```

Follow this structure inside every feature:

```
featureName/
├─ api/
├─ components/
├─ hooks/
├─ types/
├─ utils/
└─ index.ts
```

### Folders

**`api/`** — all API calls for this feature. No fetch or axios calls outside this folder.

**`components/`** — UI components scoped to this feature. Shared pieces used across multiple components within the same feature go in `components/shared/`.

**`hooks/`** — Business logic + state management
Use **React TanStack (Query/Table)** for:
- data fetching → `useQuery`, `useMutation`
- caching & syncing server state
- table logic → sorting, pagination, filtering

---

**`types/`** — TypeScript types and interfaces for this feature only. App-wide types live in `app/` instead.

**`utils/`** — pure helper functions scoped to this feature. Generic helpers that could be reused across features go in `app/utils/` instead.

**`index.ts`** — the public interface of the feature. Only what is exported here can be used outside the feature folder.

---

## Rules

- Features are **self-contained** — everything a feature needs lives inside its own folder.
- Features **never import from each other** directly. Cross-feature communication goes through the store or shared context.
- `index.ts` is the **only file** other features or pages are allowed to import from.
- Pages that render a feature live in `app/pages/` — not inside the feature folder.
- Do **not** add files directly inside `base/` — extend by composition, not by modification.

---

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Feature folder | camelCase | `billing`, `products` |
| Component folder & file | PascalCase | `InvoiceList/InvoiceList.tsx` |
| Hook file | camelCase, `use` prefix | `useBilling.ts` |
| Types file | `index.ts` | `types/index.ts` |
| API file | `index.ts` | `api/index.ts` |