# MultiSelect

## Purpose
A fully controlled multi-select dropdown with badge display, locked options, clear all, size variants, and error/hint support. Manages its own open/close state — the parent only manages the selected values array.

## Basic Usage

```tsx
import MultiSelect from '@/components/MultiSelect';

const [selected, setSelected] = useState<string[]>([]);

<MultiSelect
    options={[
        { value: 'admin',  label: 'Admin' },
        { value: 'editor', label: 'Editor' },
        { value: 'viewer', label: 'Viewer' },
    ]}
    values={selected}
    onChange={setSelected}
    label="Assign Roles"
/>
```

---

## With React Hook Form

```tsx
<MultiSelect
    options={roleOptions}
    values={watch('roles')}
    onChange={(val) => setValue('roles', val)}
    label="Roles"
    required
    error={errors.roles?.message}
/>
```

---

## Locked Options

Locked options are visually disabled and cannot be toggled or cleared — useful for a base role or a permission that must always be present:

```tsx
<MultiSelect
    options={[
        { value: 'viewer', label: 'Viewer', locked: true }, // always selected, can't remove
        { value: 'editor', label: 'Editor' },
        { value: 'admin',  label: 'Admin' },
    ]}
    values={['viewer', 'editor']}
    onChange={setSelected}
    label="Permissions"
/>
```

> `clearAll` only removes non-locked options. Locked values are preserved.

---

## With Hint and Error

```tsx
// Hint (shown when no error)
<MultiSelect
    options={options}
    values={selected}
    onChange={setSelected}
    label="Tags"
    hint="Select all that apply."
/>

// Error (replaces hint)
<MultiSelect
    options={options}
    values={selected}
    onChange={setSelected}
    label="Roles"
    error="At least one role is required."
/>
```

---

## Size Variants

```tsx
<MultiSelect options={options} values={selected} onChange={setSelected} inputSize="xs" />
<MultiSelect options={options} values={selected} onChange={setSelected} inputSize="sm" />
<MultiSelect options={options} values={selected} onChange={setSelected} inputSize="md" /> {/* default */}
<MultiSelect options={options} values={selected} onChange={setSelected} inputSize="lg" />
```

---

## Disabled State

```tsx
<MultiSelect
    options={options}
    values={selected}
    onChange={setSelected}
    label="Roles"
    disabled
/>
```

> When disabled, badges render without remove buttons and the trigger is non-interactive.

---

## Props

| Prop | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `options` | `MultiSelectOption[]` | Yes | — | Full list of options to display |
| `onChange` | `(selected: string[]) => void` | Yes | — | Called with the updated values array on every change |
| `values` | `string[]` | No | `[]` | Currently selected values — controlled |
| `label` | `string` | No | — | Label above the input |
| `placeholder` | `string` | No | `"Select options..."` | Shown when nothing is selected |
| `error` | `string` | No | — | Error message below the input — overrides hint |
| `hint` | `string` | No | — | Helper text below the input |
| `disabled` | `boolean` | No | `false` | Disables all interaction |
| `required` | `boolean` | No | `false` | Adds `*` to label |
| `inputSize` | `"xs" \| "sm" \| "md" \| "lg"` | No | `"md"` | Controls trigger and badge sizing |
| `className` | `string` | No | — | Extra classes on the outer wrapper |

### MultiSelectOption

| Prop | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `value` | `string` | Yes | Unique identifier stored in the values array |
| `label` | `string` | Yes | Display text in the dropdown and badge |
| `locked` | `boolean` | No | Prevents toggling and removal — survives `clearAll` |

---

## Notes

- The dropdown closes on outside click — the `mousedown` listener is attached to `document` and cleaned up on unmount
- The dropdown footer shows a `"X of Y selected"` count and a "Clear all" link — only visible when at least one item is selected
- `error` and `hint` are mutually exclusive — `error` always wins when both are provided
- The component is fully controlled — it holds no internal selection state, only open/close state

## Related
- [`FormControls`](../FormControls.tsx) — for consistent form field wrappers
- [`useCan`](../../app/middlewares/hooks/useCan.ts) — pair with `MultiSelect` when building a permissions assignment UI