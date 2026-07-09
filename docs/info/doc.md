# ℹ️ About Laractivate

Laractivate is a production-ready **SaaS boilerplate** built on Laravel and React. It handles the parts every SaaS product needs before it can ship a single feature — auth, roles, billing, security, and admin tooling — so you can start building your actual product instead of rebuilding the same foundation from scratch.

Stack: **Laravel API** · **React + Vite Client** · **MySQL** · **Docker**

---

## ✨ Features

### 🔑 Authentication
JWT-based auth with the token stored in an **HTTP-only cookie** rather than local storage or a bearer header — meaning tokens aren't reachable from client-side JavaScript, which closes off the most common XSS token-theft vector.

### 🛡️ Role-Based Access Control (RBAC)
Permissions and roles are decoupled from users, so access rules live in one place instead of being scattered across `if` statements throughout the codebase. Add a new role or tighten a permission without touching business logic.

### 🔒 Security

| Capability | What it does |
| :----------- | :-------------|
| **Two-Factor Authentication (2FA)** | Adds a second verification step on login, on top of the password. |
| **Session management** | Users can see their active sessions/devices and revoke any of them remotely. |
| **Activity logs tracker** | Records key account and admin actions for auditing — who did what, and when. |

### 👤 Account Management (Super Admin)
A super-admin layer for managing every account on the platform — user lookups, role assignment, and account-level actions — separate from a regular user's own settings.

### 💳 Billing (Stripe + Laravel Cashier)
Subscription billing wired up with **Laravel Cashier** on top of Stripe — plans, price tiers, webhook handling, and lifecycle events (upgrades, cancellations, failed payments) come pre-built. Full setup walkthrough: [`docs/billing/doc.md`](../billing/doc.md).

### 🔔 Notification Management
A notification system for delivering account and system events to users (e.g. billing events, security alerts, admin actions) through configurable channels.

---

## 🗺️ Where to go next

| I want to... | Go to |
| :-------------- | :------ |
| Get the project running | [Main README — Quick Start](../../README.md#-quick-start) |
| Understand every `.env` variable | [`docs/env/doc.md`](../env/doc.md) |
| Set up Stripe billing | [`docs/billing/doc.md`](../billing/doc.md) |
| Set up Docker | [`docs/docker/doc.md`](../docker/doc.md) |
| Dig into the backend | [`server/README.md`](../../server/README.md) |
| Dig into the frontend | [`client/README.md`](../../client/README.md) |

---

⬅ [Back to main README](../../README.md)