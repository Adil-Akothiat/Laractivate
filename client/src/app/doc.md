# 🧠 Core Application Layer (/app)

The `/app` directory contains the infrastructure that supports the entire Laractivate ecosystem. It manages how data flows, how routes are protected, and how the global UI behaves.

## 🔐 Middlewares & Guards

This is the security heart of the client.

- **AuthGuard.tsx**: Protects private routes. Redirects to `/login` if no valid session is found.
- **PermissionGuard.tsx**: Checks user roles against `appPermissions.ts` to restrict access to specific UI sections.
- **useCan.ts**: A functional hook used inside components to conditionally render elements based on permissions (e.g., can('delete-user')).

## 🛣️ Routing Strategy

Routes are split to keep the configuration manageable:

- **/base**: Standard routes shipped with the boilerplate (Auth, Profile, Settings, RBAC). **Avoid modifying these.**
- **/app**: This is where you define your custom business routes.
- **index.tsx**: The master manifest that merges all route groups into the React Router tree.

## 🏗️ Layouts & Providers

- **Sidebar.tsx**: The main navigation wrapper. It uses a dynamic SidebarContent component to stay clean.
- **QueryClientProvider.tsx**: Configures **TanStack Query** (React Query) for smart caching and API state management.
- **ToastProvider.tsx**: Provides a global context for trigger-based notifications (Success/Error alerts) across the app.

## 📄 Pages (Thin Wrappers)

Pages in Laractivate follow a **"Thin Wrapper"** pattern:

- **Location:** `/pages/base` (System pages) vs `/pages/app` (Your pages).
- **Logic:** Pages should contain very little logic. They simply import a "Feature" and place it inside a "Layout".
- _Example:_ `LoginPage.tsx` simply renders the `LoginFeature` inside an `AuthLayout`.

## 🛠️ Services & Utils

- **api.ts**: The pre-configured **Axios** instance. It automatically handles:
  - Injecting the Authorization Bearer token.
  - Global error catching (via errorsHandling.ts).
  - Base URL configuration from `.env`.
- **errorsHandling.ts**: A centralized utility to transform Laravel backend validation errors into readable frontend toast notifications or form-field errors.

## 💡 Summary for Developers

When adding a new feature:
1. Add your business logic in `/features`.
2. Define your route in `/app/routes/app/index.tsx`.
3. Create a thin page wrapper in `/app/pages/app/MyNewPage.tsx`.
4. Add permissions to `/app/constants/appPermissions.ts` if access control is required.