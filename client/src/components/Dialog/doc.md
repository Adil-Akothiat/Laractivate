# ConfirmDialog

## Purpose
A modal-based confirmation prompt with icon, title, message, and confirm/cancel actions. Used to gate destructive or irreversible operations behind an explicit user confirmation.

## Basic Usage

```tsx
import ConfirmDialog from '@/components/ConfirmDialog';

const [open, setOpen] = useState(false);

<ConfirmDialog
    isOpen={open}
    message="This action cannot be undone."
    onConfirm={() => handleDelete()}
    onCancel={() => setOpen(false)}
/>
```

---

## Variants

```tsx
// Destructive action (default: warning)
<ConfirmDialog
    isOpen={open}
    variant="error"
    title="Delete account?"
    message="All data associated with this account will be permanently removed."
    confirmLabel="Delete"
    onConfirm={handleDelete}
    onCancel={() => setOpen(false)}
/>

// Warning
<ConfirmDialog
    isOpen={open}
    variant="warning"
    title="Disable 2FA?"
    message="Your account will be less secure without two-factor authentication."
    confirmLabel="Disable"
    onConfirm={handleDisable2FA}
    onCancel={() => setOpen(false)}
/>

// Info
<ConfirmDialog
    isOpen={open}
    variant="info"
    title="Transfer ownership?"
    message="You will lose admin access after this action."
    confirmLabel="Transfer"
    onConfirm={handleTransfer}
    onCancel={() => setOpen(false)}
/>

// Success
<ConfirmDialog
    isOpen={open}
    variant="success"
    title="Publish changes?"
    message="This will make your changes visible to all users."
    confirmLabel="Publish"
    onConfirm={handlePublish}
    onCancel={() => setOpen(false)}
/>
```

---

## With Async Confirm + Loading State

Pair with React Query's `isPending` to disable both buttons and show a spinner while the operation runs:

```tsx
const { mutate: deleteAccount, isPending } = useMutation({
    mutationFn: () => api.delete(`/accounts/${id}`),
    onSuccess: () => {
        setOpen(false);
        navigate('/accounts');
    },
});

<ConfirmDialog
    isOpen={open}
    variant="error"
    title="Delete account?"
    message="This cannot be undone."
    confirmLabel="Delete"
    loading={isPending}
    onConfirm={() => deleteAccount()}
    onCancel={() => setOpen(false)}
/>
```

> While `loading` is `true`, the cancel button is disabled and the confirm button shows a spinner — preventing double submissions.

---

## Variants Reference

| `variant` | Icon color | Confirm button color | Use for |
| :--- | :--- | :--- | :--- |
| `warning` (default) | `text-warning` | `btn-warning` | Reversible but risky actions |
| `error` | `text-error` | `btn-error` | Destructive / permanent actions |
| `info` | `text-info` | `btn-primary` | Neutral confirmations |
| `success` | `text-success` | `btn-success` | Positive confirmations |

---

## Props

| Prop | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `isOpen` | `boolean` | Yes | — | Controls dialog visibility |
| `message` | `string` | Yes | — | Body text describing the action |
| `onConfirm` | `() => void` | Yes | — | Called when confirm button is clicked |
| `onCancel` | `() => void` | Yes | — | Called when cancel button or backdrop is clicked |
| `title` | `string` | No | `"Are you sure?"` | Dialog heading |
| `confirmLabel` | `string` | No | `"Confirm"` | Confirm button text |
| `cancelLabel` | `string` | No | `"Cancel"` | Cancel button text |
| `variant` | `"error" \| "warning" \| "info" \| "success"` | No | `"warning"` | Controls icon and confirm button color |
| `loading` | `boolean` | No | `false` | Shows spinner on confirm, disables both buttons |

---

## Notes

- The close button is intentionally hidden — the only exit paths are confirm or cancel, keeping the user's intent explicit
- `onCancel` is wired to both the cancel button and the modal backdrop click — they behave identically
- The confirm button color maps to the variant automatically — no need to pass a button variant separately

## Related
- [`Modal`](../Modal.tsx) — the underlying modal primitive
- [`Button`](../Button.tsx) — used for confirm and cancel actions