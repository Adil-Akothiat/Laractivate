# 📦 AuthPanel Boilerplate

AuthPanel is a full-stack SaaS authentication boilerplate built with:

- Laravel API
- React + Vite Client
- MySQL
- Docker Infrastructure

---

# 📌 Requirements

Before running the project, make sure Docker is installed on your machine.

| Requirement | Documentation |
| :--- | :--- |
| **Docker Setup Guide** | [./docs/docker/doc.md](./docs/docker/doc.md) |
| **Docker Desktop** | https://www.docker.com/products/docker-desktop/ |
| **WSL2 Installation** | https://learn.microsoft.com/en-us/windows/wsl/install |

---

# 🚀 Quick Start

After installing Docker and cloning the repository, run the following commands:

## 1. Start Docker Containers

```bash
docker-compose up -d --build
```

## 2. Install Dependencies

```bash
docker-compose exec app composer install
docker-compose exec client npm install
```

## 3. Setup Database

```bash
docker-compose exec app php artisan migrate --seed
```

---

# 🌐 Application URLs

| Service | URL |
| :--- | :--- |
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |

---

# 📚 Documentation

## 🖥️ Backend Documentation (Laravel)

Documentation for backend architecture, APIs, authentication, and services.

| Component | Documentation Link |
| :--- | :--- |
| **Core Server Docs** | [./docs/server/doc.md](./docs/server/doc.md) |

---

## 💻 Frontend Documentation (React.js)

Documentation for frontend features and UI components.

| Component | Documentation Link |
| :--- | :--- |
| **Core Client Docs** | [./docs/client/doc.md](./docs/client/doc.md) |

---

## 🐳 Docker & Infrastructure

Documentation for Docker setup, infrastructure, containers, and troubleshooting.

| Component | Documentation Link |
| :--- | :--- |
| **Docker Infrastructure Docs** | [./docs/docker/doc.md](./docs/docker/doc.md) |

---

## 🌐 Global & External

- **React:** https://react.dev
- **Laravel:** https://laravel.com/docs/12.x

---

# 📂 Documentation Structure

```txt
docs/
├─ assets/
│  └─ docker_installer_config.png
├─ docker/
│  └─ doc.md
├─ server/
│  └─ doc.md
└─ client/
   └─ doc.md
```

---

# 🛠️ Common Commands

## Stop Containers

```bash
docker-compose down
```

## View Logs

```bash
docker-compose logs -f
```

## Restart Client

```bash
docker-compose restart client
```

## Reset Database

```bash
docker-compose exec app php artisan migrate:fresh --seed
```