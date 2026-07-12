# 📦 Laractivate Boilerplate
 
A production-ready **SaaS boilerplate** — the auth, roles, billing, security, and admin foundation every SaaS product needs, already built, so you can start on your actual product instead of rebuilding the basics.
 
- Laravel API
- React + Vite Client
- MySQL
- Docker Infrastructure
## ✨ Features
 
- 🔑 JWT authentication, token stored in an HTTP-only cookie
- 🛡️ Role-Based Access Control (RBAC)
- 🔒 Security: 2FA, session management, activity logs
- 👤 Account management (super admin)
- 💳 Billing — Stripe + Laravel Cashier
- 🔔 Notification management
> 📖 Full breakdown of every feature: [`docs/info/doc.md`](./docs/info/doc.md)
 
---

# 📌 Requirements

Before running the project, make sure **Docker** is installed and running on your machine.

**Check if Docker is installed:**

```bash
docker --version
docker-compose --version
```

You should see output like `Docker version 27.x.x` and `Docker Compose version v2.x.x`. If instead you get a `command not found` error, Docker isn't installed yet — see the setup guide below.

**Check that Docker is actually running:**

```bash
docker info
```

If this hangs or errors out (e.g. `Cannot connect to the Docker daemon`), Docker is installed but not running — start Docker Desktop (or the Docker service) and try again.

> 📖 See the [Docker Setup Guide](./docs/docker/doc.md) for installation instructions (Docker Desktop, Hyper-V vs WSL2, and troubleshooting).

---

# 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Adil-Akothiat/Laractivate.git
cd laractivate
```

### 2. Start Docker Containers

```bash
chmod +x setup.sh
```
Then:
```bash
./setup.sh
```
> ⏳ The first build may take a few minutes.

### 3. Set Up Stripe (only if you need payments) 💳

The project runs fine without Stripe configured. If your app needs billing/subscriptions, follow the full walkthrough in [`docs/billing.md`](./docs/billing/doc.md) to connect your Stripe sandbox and capture your webhook secret.


### 4. Verify Everything Is Running

```bash
docker-compose ps
```

All services (`app`, `client`, `db`) should show status **Up**.

---

# 📚 Documentation

## 🖥️ Backend (Laravel)

| Component        | Link                                        |
| :---------------- | :------------------------------------------ |
| Core Server Docs | [./server/README.md](./server/README.md)    |

## 💻 Frontend (React.js)

| Component        | Link                                        |
| :---------------- | :------------------------------------------ |
| Core Client Docs | [./client/README.md](./client/README.md)    |

## 🐳 Docker & Infrastructure

| Component                  | Link                                          |
| :-------------------------- | :--------------------------------------------- |
| Docker Infrastructure Docs | [./docs/docker/doc.md](./docs/docker/doc.md)  |

## ⚙️ Environment Variables

| Component            | Link                                |
| :--------------------- | :------------------------------------ |
| Full `.env` Reference | [./docs/env.md](./docs/env/doc.md)      |

## 💳 Billing (Stripe)

| Component        | Link                                        |
| :----------------- | :-------------------------------------------- |
| Stripe & Webhook Setup | [./docs/billing.md](./docs/billing/doc.md) |

## 🌐 External References

- **React:** https://react.dev
- **Laravel:** https://laravel.com/docs/12.x


---

# 🛠️ Common Commands
Check more docker compose commands here: [./docs/docker/commands](./docs/docker/commands.md)