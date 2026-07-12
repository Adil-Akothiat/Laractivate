# UI Component Library

A comprehensive set of ready-to-use components built on DaisyUI and Tailwind CSS.

---

## Documented Components

These components have non-obvious behavior and their own dedicated documentation:

| Component | Description | Documentation |
| :--- | :--- | :--- |
| **Can** | Permission-based conditional rendering | [Guard/doc.md](../Guard/doc.md) |
| **DataTable** | Generic type-safe table with actions, loading, and permission gating | [Table/doc.md](../Table/doc.md) |
| **AvatarUploader** | Click-to-upload avatar with live preview and initials fallback | [FileUploader/doc.md](../FileUploader/doc.md) |
| **ConfirmModal** | Modal confirmation prompt for destructive actions | [Dialog/doc.md](../Dialog/doc.md) |
| **MultiSelect** | Multi-select dropdown with locked options and badge display | [MultiSelect/doc.md](../MultiSelect/doc.md) |
| **Pagination** | Smart pagination bar with truncation and results summary | [Pagination/doc.md](../Pagination/doc.md) |
| **Tabs** | Horizontal and vertical tabs — controlled and uncontrolled | [Tabs/doc.md](../Tabs/doc.md) |
| **Chart** | Chart wrapper and data shape reference | [Chart/doc.md](../Chart/doc.md) |

---

## Simple Components

These are thin DaisyUI wrappers — open the file directly, the implementation is self-explanatory:

| Component | File |
| :--- | :--- |
| Alert | [Alert.tsx](../Alert.tsx) |
| Avatar | [Avatar.tsx](../Avatar.tsx) |
| Badge | [Badge.tsx](../Badge.tsx) |
| Breadcrumb | [Breadcrumb.tsx](../Breadcrumb.tsx) |
| Button | [Button.tsx](../Button.tsx) |
| Card | [Card.tsx](../Card.tsx) |
| Container | [Container.tsx](../Container.tsx) |
| Dropdown | [Dropdown.tsx](../Dropdown.tsx) |
| EmptyState | [EmptyState.tsx](../EmptyState.tsx) |
| FormControls | [FormControls.tsx](../FormControls.tsx) |
| Input | [Input.tsx](../Input.tsx) |
| Loaders | [Loaders.tsx](../Loaders.tsx) |
| Loading | [Loading.tsx](../Loading.tsx) |
| Modal | [Modal.tsx](../Modal.tsx) |
| PageHeader | [PageHeader.tsx](../PageHeader.tsx) |
| ScrollContainer | [ScrollContainer.tsx](../ScrollContainer.tsx) |
| Select | [Select.tsx](../Select.tsx) |
| Sidebar | [Sidebar.tsx](../Sidebar.tsx) |
| StatCard | [StatCard.tsx](../StatCard.tsx) |
| Switch | [Switch.tsx](../Switch.tsx) |
| Textarea | [Textarea.tsx](../Textarea.tsx) |
| Topbar | [Topbar.tsx](../Topbar.tsx) |

---

## Importing Components

All components are exported from the root `index.ts` — import from there, never directly from subfolders:

```tsx
// Correct
import { Button, Badge, Modal } from '@/components';
import DataTable from '@/components/Table/DataTable';
import Tabs from '@/components/Tabs/Tabs';

// Avoid
import Button from '@/components/Button';         // works but bypasses the barrel
import { Table } from '@/components/Table/index'; // internal — subject to change
```

---

## External References

- [DaisyUI Components](https://daisyui.com/components/) — base component library
- [Tailwind CSS](https://tailwindcss.com/docs) — utility classes
- [Lucide Icons](https://lucide.dev/icons/) — icon library used throughout