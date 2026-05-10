# Pages

## Structure
pages/
├─ app/ # your custom pages (safe to edit)
├─ base/ # boilerplate pages (do not modify)
│ ├─ accounts/
│ ├─ auth/
│ ├─ dashboard/
│ ├─ rbac/
│ │ └─ AccessControlPage.tsx
│ └─ settings/
└─ doc.md


---

## Overview

The `pages/` directory contains all **route-level pages** of the application.

It is divided into two main parts:

- **`base/`** → core boilerplate pages  
- **`app/`** → your custom pages  

---

## Base Pages (`base/`)

These are pre-built pages provided by the boilerplate.

### Includes

- `auth/` → login, register, authentication flows
- `dashboard/` → main dashboards
- `settings/` → profile, security, sessions
- `accounts/` → user management
- `rbac/` → roles & permissions (e.g. `AccessControlPage.tsx`)

### Rules

- ❌ Do not modify anything inside `base/`
- ❌ Do not add new pages here
- ✅ Use as-is or extend via features

> This ensures your project stays **upgrade-safe**

---

## App Pages (`app/`)

This is your **working area**.

Create all your custom pages here.

### Example
pages/app/
└─ products/
├─ ProductsPage.tsx
└─ ProductDetailsPage.tsx


---

## Page Responsibilities

Pages should be **thin** and only:

- Handle routing
- Compose feature components
- Pass route params (id, query, etc.)

---

## Example

```tsx
import { ProductsList } from '@/features/products';

const ProductsPage = () => {
  return <ProductsList />;
};

export default ProductsPage;