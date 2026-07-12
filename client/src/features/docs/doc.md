# Features

The `features/` directory contains all product functionality, split into two clear zones.

---

## Two Zones

| Zone | Folder | Description |
| :--- | :--- | :--- |
| **Base** | `features/base/` | Pre-built features shipped with Laractivate — auth, dashboard, accounts, RBAC, settings, notifications |
| **App** | `features/app/` | Where you build your own product features |

> Never modify the internals of `features/base/`. Extend through your own features in `features/app/` instead.

---

## Feature Folder Convention

Every feature — whether base or yours — follows the same internal structure:

```
feature-name/
├─ api/           ← React Query calls (useQuery, useMutation)
├─ components/    ← UI components scoped to this feature
├─ hooks/         ← feature-specific hooks
├─ types/         ← TypeScript types and interfaces
├─ utils/         ← helper functions
└─ index.ts       ← public exports
```

> Always import from a feature's `index.ts` — never from its internal subfolders directly.

```ts
// Correct
import { useAuth } from '@/features/base/auth';

// Avoid
import { useAuth } from '@/features/base/auth/hooks/useAuth';
```

---

## Base Features

### 🔐 Auth (`features/base/auth/`)

Complete authentication flow with forms, hooks, and API calls.

```
auth/
├─ api/                     ← login, register, forgot/reset password API calls
├─ components/
│  ├─ shared/               ← AuthBanner, shared config
│  ├─ ForgotPasswordForm.tsx
│  ├─ LoginForm.tsx
│  ├─ RegisterForm.tsx
│  └─ ResetPasswordForm.tsx
├─ hooks/
│  ├─ useAuth.ts            ← login, logout, register mutations
│  └─ useTwoFactor.ts       ← 2FA setup, verify, disable
└─ types/
```

**Covered flows:** Login · Register · Forgot Password · Reset Password · 2FA setup and verification

---

### 📊 Dashboard (`features/base/dashboard/`)

Two dashboard modes rendered based on user role.

```
dashboard/
├─ api/
├─ components/
│  ├─ personal/             ← PersonalDashboard, PersonalStatsGrid
│  ├─ shared/               ← RecentActivity, WelcomeBanner
│  └─ system/               ← SystemDashboard, SystemHealth, UserComposition, UserGrowChart
├─ hooks/
│  └─ useDashboard.ts
└─ types/
```

**Personal dashboard** — stats and activity for the logged-in user.
**System dashboard** — admin view with system health, user composition charts, and growth analytics.

---

### 👥 Accounts (`features/base/accounts/`)

Full admin user directory and detailed per-user management.

```
accounts/
├─ api/
├─ components/
│  ├─ Account/              ← single user detail view
│  │  ├─ Access/            ← role assignment, permissions view
│  │  ├─ ActivityLog/       ← per-user audit trail
│  │  ├─ DangerZone/        ← account deletion with confirm dialog
│  │  ├─ Profile/           ← profile view and edit modal
│  │  ├─ Security/          ← password and 2FA cards
│  │  └─ Sessions/          ← active sessions and session history
│  ├─ Accounts/             ← accounts list with search, filter, and DataTable
│  └─ Shared/
├─ hooks/
└─ types/
```

**List view** — searchable, filterable DataTable of all users.
**Detail view** — tabbed interface covering profile, security, sessions, access, and activity.

---

### 🛡️ RBAC (`features/base/rbac/`)

Role and permission management UI.

```
rbac/
├─ api/
├─ components/
│  ├─ CreateRole.tsx
│  ├─ UpdateRole.tsx
│  ├─ RoleDeleteModal.tsx
│  ├─ RolesList.tsx
│  ├─ PermissionsGrid.tsx   ← toggle permissions per role
│  ├─ PermissionsCheckBox.tsx
│  └─ SearchAndFilterRoles.tsx
├─ hooks/
└─ types/
```

**Roles** — create, update, and delete roles.
**Permissions Grid** — toggle individual permissions per role via a visual checkbox grid.

---

### ⚙️ Settings (`features/base/settings/`)

User-facing settings pages — all scoped to the logged-in user.

```
settings/
├─ api/
├─ components/
│  ├─ 2FA/                  ← step wizard: Intro → Scan QR → Verify → Success
│  │  ├─ OtpInput.tsx
│  │  ├─ StepIntro.tsx
│  │  ├─ StepScan.tsx
│  │  ├─ StepVerify.tsx
│  │  └─ StepSuccess.tsx
│  ├─ ActivityLogs/         ← personal audit trail with ProfileDiff
│  ├─ PasswordChange/
│  ├─ Profile/              ← profile edit, avatar upload, danger zone
│  ├─ Sessions/             ← active sessions with device icons, remote logout
│  └─ Shared/               ← MiniSidebar layout, SettingsContainer
├─ hooks/
│  └─ useSessions.ts
├─ types/
└─ utils/
   └─ logActivities/        ← event config and helpers for activity log rendering
```

**Pages:** Profile · Change Password · Two-Factor Auth · Sessions · Activity Logs

---

### 🔔 Notifications (`features/base/notifications/`)

Real-time notification system.

```
notifications/
├─ api/
├─ components/
│  ├─ NotificationBell.tsx      ← bell icon with unread count badge
│  ├─ NotificationDropDown.tsx  ← quick-view dropdown
│  ├─ NotificationItem.tsx
│  ├─ NotificationRow.tsx
│  └─ NotificationsList.tsx     ← full notification history page
├─ hooks/
│  └─ useNotification.ts
├─ types/
└─ utils/
   └─ notification.ts
```

**Bell** — live unread count, dropdown preview.
**List page** — full notification history with read/unread state.

---

### 🤝 Shared (`features/base/shared/`)

Cross-feature components shared between base features only.

```
shared/
└─ components/
   ├─ Disable2FAModal.tsx    ← used in both settings and accounts
   ├─ LogCard.tsx            ← activity log card used in settings and accounts
   ├─ SessionCard.tsx        ← session card used in settings and accounts
   └─ TwoFactorDialog.tsx    ← 2FA confirmation prompt
```

> These components are internal to `features/base/`. Import them from here, not from individual feature folders.

---

## App Zone (`features/app/`)

This is where your product lives. Add a new folder per feature following the same convention:

```
features/app/
└─ your-feature/
   ├─ api/
   ├─ components/
   ├─ hooks/
   ├─ types/
   └─ index.ts
```