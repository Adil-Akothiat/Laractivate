# Laractivate Client (React + Vite)

The frontend application built with React 19, Vite, TailwindCSS, and DaisyUI.

---

## Dependencies

### Core

| Package | Version | Purpose |
| :--- | :--- | :--- |
| `react` | 19 | UI framework |
| `react-dom` | 19 | DOM rendering |
| `react-router-dom` | 7 | Client-side routing |
| `@tanstack/react-query` | 5 | Server state management |
| `axios` | 1 | HTTP client |
| `tailwindcss` | 4 | Utility CSS framework |
| `daisyui` | 5 | Component library built on Tailwind |
| `lucide-react` | 0.575 | Icon library |
| `recharts` | 3 | Chart library |
| `qrcode.react` | 4 | QR code rendering (used in 2FA setup) |

### Dev

| Package | Purpose |
| :--- | :--- |
| `vite` | Build tool and dev server |
| `typescript` | Type checking |
| `@vitejs/plugin-react` | React fast refresh in Vite |
| `eslint` + plugins | Linting |

---

## Installing Dependencies

Since the client runs inside Docker, all package management must go through the container:

```bash
# Install a new dependency
docker-compose exec client npm install <package-name>

# Install a dev dependency
docker-compose exec client npm install -D <package-name>

# Remove a dependency
docker-compose exec client npm uninstall <package-name>

# Install all dependencies (after cloning or pulling changes)
docker-compose exec client npm install
```

> Never run `npm install` directly on your machine — always go through the container to keep the lock file consistent across environments.

---

## Project Structure

```
Laractivate/               ← repo root
├─ client/                 ← React app root
│  ├─ src/                 ← all application source code
│  ├─ .env                 ← environment variables (see below)
│  ├─ index.html
│  ├─ package.json
│  ├─ tailwind.config.ts
│  ├─ tsconfig.json
│  └─ vite.config.ts
├─ docker-config/                 ← nginx
├─ docs/                 ← include docker documentation (setup)
├─ server/                 ← Laravel API
├─ docker-compose.yml
└─ .env                    ← Docker / Laravel environment variables
```

---

## Environment Variables (`client/.env`)

| Variable | Description |
| :--- | :--- |
| `VITE_API_URL` | Base URL for all API calls — used by Axios |
| `VITE_PUBLIC_API` | Base URL for public assets (e.g. avatar images served by Laravel) |

> All Vite environment variables must be prefixed with `VITE_` to be accessible in the browser. Variables without this prefix are ignored at build time.

---

## Src Structure

## 📁 Project Structure Overview

The `src` directory is organized into four main pillars to ensure a clean separation of concerns, global state management, and feature-driven development.

| Folder | Responsibility | Documentation |
| :--- | :--- | :--- |
| `/app` | **The Core Layer.** Contains global configurations, providers, and logic that powers the entire application. | [View Docs](./src/app/doc.md) |
| `/assets` | **Static Files.** Storage for images, icons, and SVG files used throughout the UI. | [View Docs](./src/assets/doc.md) |
| `/components` | **UI Library.** A collection of pure, reusable atomic components (Buttons, Inputs, Modals) that have no business logic. | [View Docs](./src/components/docs/doc.md) |
| `/features` | **Domain Logic.** Where the actual product lives. Split into `base` (core system) and `app` (custom developer features). | [View Docs](./src/features/docs/doc.md) |

---

# 🚀 The `/app` Layer (Global Context)

The `/app` folder is the most important part of the architecture. It acts as the "glue" that holds the application together.

Anything placed here is intended to be globally accessible or used to wrap the entire application tree.

## Key Responsibilities of the `/app` Layer

- **Infrastructure**  
  Setting up how the app communicates with the outside world (API services, Axios instances).

- **Security**  
  Handling route protection and access control (middlewares/guards).

- **Context**  
  Providing global state to every component (Auth providers, Theme providers, Toast notifications).

- **Navigation**  
  Defining the routing table and global layouts (Sidebars, Footers) that persist across different pages.

- **Standardization**  
  Managing global TypeScript types, utility functions, and application-wide constants.

---

# 📄 Entry Files

### `main.tsx`

The critical entry point of the application.

Responsible for:

- Initializing the React DOM
- Wrapping the application with global providers defined inside `/app`

### `index.css`

The global stylesheet of the application.

Responsible for:

- Injecting Tailwind CSS
- Defining base application styles