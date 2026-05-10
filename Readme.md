# 📦 Laractivate Boilerplate

Laractivate is a full-stack SaaS authentication boilerplate built with:

- Laravel API
- React + Vite Client
- MySQL
- Docker Infrastructure

---

# 📌 Requirements

Before running the project, make sure **Docker** is installed and running on your machine.

> 📖 See the [Docker Setup Guide](./docs/docker/doc.md) for installation instructions (Docker Desktop, Hyper-V vs WSL2, and troubleshooting).

---

# 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/laractivate.git
cd laractivate
```

### 2. Configure Environment

```bash
cp .env.example .env
```

> Open `.env` and adjust database credentials or ports if needed. The defaults work out of the box with Docker.

### 3. Start Docker Containers

```bash
docker-compose up -d --build
```

> ⏳ The first build may take a few minutes. Run `docker-compose logs -f` to follow progress.

### 4. Install Dependencies

```bash
docker-compose exec app composer install
docker-compose exec client npm install
```

### 5. Setup Database

```bash
docker-compose exec app php artisan migrate --seed
```

### 6. Verify Everything Is Running

```bash
docker-compose ps
```

All services (`app`, `client`, `db`) should show status **Up**.

---

# 🌐 Application URLs

| Service      | URL                    |
| :----------- | :--------------------- |
| Frontend     | http://localhost:5173  |
| Backend API  | http://localhost:8000  |

---

# 📚 Documentation

## 🖥️ Backend (Laravel)

| Component           | Link                                        |
| :------------------ | :------------------------------------------ |
| Core Server Docs    | [./docs/server/doc.md](./docs/server/doc.md) |

## 💻 Frontend (React.js)

| Component           | Link                                        |
| :------------------ | :------------------------------------------ |
| Core Client Docs    | [./docs/client/doc.md](./docs/client/doc.md) |

## 🐳 Docker & Infrastructure

| Component                  | Link                                          |
| :------------------------- | :-------------------------------------------- |
| Docker Infrastructure Docs | [./docs/docker/doc.md](./docs/docker/doc.md)  |

## 🌐 External References

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

### Stop Containers

```bash
docker-compose down
```

### View Logs

```bash
docker-compose logs -f
```

### Restart Client

```bash
docker-compose restart client
```

### Reset Database

```bash
docker-compose exec app php artisan migrate:fresh --seed
```