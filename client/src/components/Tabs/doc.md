# Tabs

## Purpose
A flexible tab component that works both controlled and uncontrolled, supports horizontal and vertical layouts, four DaisyUI variants, icons, badges, and disabled states.

## Basic Usage (Uncontrolled)

Content is passed directly in the `tabs` array — the component manages the active state internally:

```tsx
import Tabs from '@/components/Tabs';

<Tabs
    tabs={[
        { key: 'profile',   label: 'Profile',   content: <ProfileForm /> },
        { key: 'security',  label: 'Security',  content: <SecuritySettings /> },
        { key: 'sessions',  label: 'Sessions',  content: <SessionsList /> },
    ]}
/>
```

---

## Controlled

Pass `activeKey` and `onChange` when the parent needs to control the active tab — e.g. syncing with a URL query param:

```tsx
const [tab, setTab] = useState('profile');

<Tabs
    tabs={tabs}
    activeKey={tab}
    onChange={(key) => {
        setTab(key);
        navigate(`?tab=${key}`);
    }}
/>
```

---

## Variants

```tsx
<Tabs tabs={tabs} variant="default"  />  {/* default — underline style */}
<Tabs tabs={tabs} variant="boxed"    />  {/* pill buttons in a box */}
<Tabs tabs={tabs} variant="lifted"   />  {/* card-like lifted tabs */}
<Tabs tabs={tabs} variant="bordered" />  {/* underline with border */}
```

---

## Size Variants

```tsx
<Tabs tabs={tabs} size="xs" />
<Tabs tabs={tabs} size="sm" />
<Tabs tabs={tabs} size="md" />  {/* default */}
<Tabs tabs={tabs} size="lg" />
```

---

## With Icons and Badges

```tsx
import { Shield, User, Monitor } from 'lucide-react';

<Tabs
    tabs={[
        {
            key:     'profile',
            label:   'Profile',
            icon:    <User size={14} />,
            content: <ProfileForm />,
        },
        {
            key:     'sessions',
            label:   'Sessions',
            icon:    <Monitor size={14} />,
            badge:   3,              // e.g. active session count
            content: <SessionsList />,
        },
        {
            key:      'security',
            label:    'Security',
            icon:     <Shield size={14} />,
            disabled: true,
            content:  <SecuritySettings />,
        },
    ]}
/>
```

---

## Vertical Layout

Renders the tab list as a left sidebar with content filling the remaining space:

```tsx
<Tabs
    tabs={tabs}
    vertical
    sidebarClassName="w-48 border-r border-base-200"
/>
```

---

## Tabs Without Content (Navigation Only)

Set `renderContent={false}` when tabs are used purely for navigation and content is rendered elsewhere:

```tsx
<Tabs
    tabs={tabs}
    activeKey={currentTab}
    onChange={setCurrentTab}
    renderContent={false}
/>

{/* Content rendered separately */}
{currentTab === 'profile'  && <ProfileForm />}
{currentTab === 'security' && <SecuritySettings />}
```

---

## Props

### Tabs

| Prop | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `tabs` | `TabItem[]` | Yes | — | Tab definitions |
| `activeKey` | `string` | No | First tab key | Controlled active tab — requires `onChange` |
| `onChange` | `(key: string) => void` | No | — | Called when active tab changes |
| `variant` | `"default" \| "boxed" \| "lifted" \| "bordered"` | No | `"default"` | Visual style |
| `size` | `"xs" \| "sm" \| "md" \| "lg"` | No | `"md"` | Tab button size |
| `renderContent` | `boolean` | No | `true` | Whether to render the active tab's content |
| `vertical` | `boolean` | No | `false` | Renders tabs as a vertical sidebar |
| `sidebarClassName` | `string` | No | — | Extra classes on the vertical tab list |
| `className` | `string` | No | — | Extra classes on the outer wrapper |

### TabItem

| Prop | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `key` | `string` | Yes | Unique identifier for the tab |
| `label` | `ReactNode` | Yes | Tab button label |
| `content` | `ReactNode` | No | Content rendered when this tab is active |
| `icon` | `ReactNode` | No | Icon rendered before the label |
| `badge` | `string \| number` | No | Badge rendered after the label |
| `disabled` | `boolean` | No | Prevents the tab from being selected |

---

## Notes

- The component works uncontrolled by default — `activeKey` and `onChange` are both optional
- When `onChange` is provided without `activeKey`, the component uses its internal state as fallback — this is intentional to avoid a broken tab when `activeKey` is briefly `undefined`
- Disabled tabs are non-interactive — clicking them does nothing and the cursor shows `not-allowed`
- Tab content is wrapped in `ScrollContainer` — the content area scrolls independently of the page
- `sidebarClassName` only applies in `vertical` mode

## Related
- [`ScrollContainer`](../ScrollContainer.tsx) — wraps the active tab content