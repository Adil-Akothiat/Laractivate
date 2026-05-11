# AvatarUploader

## Purpose
A click-to-upload avatar component with live preview, initials fallback, upload spinner, and error display. Handles file selection, preview generation, and `FormData` construction — the parent only needs to handle the API call.

## Basic Usage

```tsx
import AvatarUploader from '@/components/AvatarUploader';

<AvatarUploader
    avatarUrl={user.avatar_url}
    firstName={user.first_name}
    lastName={user.last_name}
    isUploading={isPending}
    isError={isError}
    error={error}
    onUpload={(formData) => uploadAvatar(formData)}
/>
```

---

## With React Query

The component pairs directly with a `useMutation` upload hook:

```tsx
const { mutate: uploadAvatar, isPending, isError, error } = useMutation({
    mutationFn: (formData: FormData) => api.post('/profile/avatar', formData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['me'] }),
});

<AvatarUploader
    avatarUrl={user.avatar_url}
    firstName={user.first_name}
    lastName={user.last_name}
    isUploading={isPending}
    isError={isError}
    error={error}
    onUpload={uploadAvatar}
/>
```

---

## Compact Mode

Hides the helper text ("Profile photo · JPG, PNG...") — useful in tight layouts like account cards or modals:

```tsx
<AvatarUploader
    avatarUrl={user.avatar_url}
    firstName={user.first_name}
    lastName={user.last_name}
    onUpload={uploadAvatar}
    compact
/>
```

---

## States

| State | Behavior |
| :--- | :--- |
| **No avatar, no name** | Shows `?` in a circle |
| **No avatar, has name** | Shows initials (e.g. `AK`) |
| **Has avatar** | Renders the image |
| **Hover** | Overlay with camera icon + "Upload" label |
| **Uploading** | Overlay with spinner, button disabled |
| **Error** | `Alert` rendered above the avatar |

---

## Props

| Prop | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `onUpload` | `(formData: FormData) => void` | Yes | — | Called with ready-to-send `FormData` after file selection |
| `avatarUrl` | `string \| null` | No | — | Current avatar URL from the server |
| `firstName` | `string` | No | — | Used to generate initials fallback |
| `lastName` | `string` | No | — | Used to generate initials fallback |
| `isUploading` | `boolean` | No | `false` | Shows spinner overlay and disables the button |
| `isError` | `boolean` | No | `false` | Triggers error alert display |
| `error` | `unknown` | No | — | Error object — parsed by `getErrorsMessages()` |
| `compact` | `boolean` | No | `false` | Hides helper text below the avatar |

---

## Notes

- Accepted formats: `image/png`, `image/jpeg`, `image/webp`, `image/gif`
- The preview is generated via `URL.createObjectURL()` — it updates instantly on file selection without waiting for the upload to complete
- The file input resets after each selection (`e.target.value = ""`) so the same file can be re-selected if needed
- `avatarUrl` changes from the server (after a successful upload) are picked up via `useEffect` — the preview stays in sync with the server state
- The `FormData` key is `"avatar"` — your API endpoint should expect `request()->file('avatar')`

## Related
- [`imagePreviewHandler`](../../app/utils/imagePreviewHandler.tsx) — handles URL normalization before rendering
- [`Alert`](../Alert.tsx) — used to display upload errors
- [`getErrorsMessages`](../../app/utils/index.ts) — parses Laravel validation error shapes into string arrays