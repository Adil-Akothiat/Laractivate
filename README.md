# 📦 Laractivate Boilerplate

- Laravel API
- React + Vite Client
- MySQL
- Docker Infrastructure

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

### 2. Configure Environment

```bash
cp ./server/.env.example ./server/.env
```

> 📖 Full breakdown of every variable — what it does, its default, and whether you need to change it — lives in [`./server/docs/env.md`](./server/docs/env.md).

### 3. Start Docker Containers

```bash
docker-compose up -d --build
```
> ⏳ The first build may take a few minutes.

### 4. Setup Database

```bash
docker-compose exec app php artisan migrate --seed
```

### 5. Generate Application Keys 🔑

Because Laractivate uses Docker, the standard `php artisan` commands can't write to your `.env` file directly. Generate each key, then paste it into `server/.env` yourself.

**Laravel App Key** — encrypts sessions and sensitive data:

```bash
docker-compose exec app php artisan key:generate --show
```
```plaintext
APP_KEY=base64:your_generated_key_here
```

**JWT Secret** — signs authentication tokens (required for login to work):

```bash
docker-compose exec app php artisan jwt:secret --show
```
```plaintext
JWT_SECRET=your_generated_jwt_secret_here
```

### 6. Set Up Stripe (only if you need payments) 💳

The project runs fine without Stripe configured. If your app needs billing/subscriptions, follow the full walkthrough in [`./server/docs/billing.md`](./server/docs/billing.md) to connect your Stripe sandbox and capture your webhook secret.

### 7. Verify Everything Is Running

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
| Full `.env` Reference | [./docs/env.md](./docs/env.md)      |

## 💳 Billing (Stripe)

| Component        | Link                                        |
| :----------------- | :-------------------------------------------- |
| Stripe & Webhook Setup | [./docs/billing.md](./docs/billing.md) |

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
├─ client/
│  └─ doc.md
├─ env.md
└─ billing.md
```

---

# 🛠️ Common Commands

### Stop Containers

```bash
docker-compose stop
```
### Start Containers

```bash
docker-compose start
```

### Restart Containers

```bash
docker-compose restart
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

### The "Bridge" Command: `docker-compose exec`

```bash
docker-compose exec [service_name] [command]
```

#### Example
- Client:
```bash
docker-compose exec client npm install <package-name>
```

- Server:
```bash
docker-compose exec app composer require <package-name>
```