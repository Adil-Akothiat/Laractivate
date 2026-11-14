# Feature Slice Architecture

Each feature slice in `src/features/<featureName>/` represents **one user capability** (something the user does that changes data). It is self-contained and organized by technical role, so business logic, API mutations, and UI components are easy to locate, maintain, and scale.

## Structure

```text
src/features/<featureName>/
├── api/          # send changes to the server
│   └── <verbNoun>.api.ts
├── model/        # types, schemas, workflow hooks (optional)
│   ├── <verbNoun>.types.ts
│   ├── <verbNoun>.schema.ts
│   └── use<Workflow>.ts
├── ui/           # small interactive pieces
│   └── <VerbNoun>.tsx
├── view/         # a complete section of a screen
│   └── <FeatureName>View.tsx
└── index.ts      # public API
```

## What each folder does

| Folder | Job | What goes inside |
|---|---|---|
| `api/` | Send changes to the server | One file per action: the endpoint function and its `useMutation` hook. The hook refreshes the affected entity queries after success |
| `model/` | Describe and validate data (optional) | Payload and form types, Zod schemas, hooks for multi-step or complex state |
| `ui/` | Let the user act | Action buttons, forms, modals, and static components used only by this feature |
| `view/` | Build a screen section | Fetches data through entity hooks, handles loading and empty states, and combines entity components with this feature's `ui/` |
| `index.ts` | Control what is shared | Exports the views, and any action component reused outside the view |

## Rules for each folder

- **`api/`**: mutations only. Queries and query keys live in `entities/`, and URLs come from `@/shared/config`.
- **`model/`**: only feature-specific types. Domain models go in `entities/`, and component props stay in the component's file.
- **`ui/`**: no data fetching and no imports from other features.
- **`view/`**: no direct API calls, and no routing or page layout (that is for `pages/`).
- **`index.ts`**: never export internal sections, helpers or raw API functions.

## Example: `api/updateItem.api.ts`

```ts
const updateItem = ({ id, ...payload }: UpdateItemPayload) =>
  api.put<ResourceSchema<Item>>(API_ROUTES.items.byId(id), payload);

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemQueries.all() }),
  });
};
```

## Example: `index.ts`

```ts
export { ItemsView } from './view/ItemsView';
export { RemoveItem } from './ui/RemoveItem';
```

## Import rules

A feature may import from `entities/` and `shared/` only. It never imports from other features, `pages/` or `app/`. To combine two features, compose them in a page.

## Naming

Use camelCase for everything except React component files, which are PascalCase.

- Files: `updateItem.api.ts`, `updateItem.types.ts`, `useItemSetup.ts`
- Hooks and types: `useUpdateItem`, `UpdateItemPayload`
- Components: `RemoveItem.tsx`, `ItemsView.tsx`