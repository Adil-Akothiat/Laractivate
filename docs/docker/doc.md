# 🐳 Docker Infrastructure & Setup Guide

This document provides a comprehensive guide on how to set up, configure, and run the AuthPanel boilerplate using Docker.

---

## 📌 Prerequisites

Before you begin, ensure you have the following installed:

- Docker Desktop: Download here
- WSL2 (Windows users): Ensure WSL2 is enabled for better performance.
- Recommended Disk Space: At least 5GB on the drive where Docker data is stored.

---

# 🚀 Quick Start (The "3-Command" Setup)

Once you have the repository cloned, run these commands in your root terminal:

## Build & Start Containers

```bash
docker-compose up -d --build
```

## Install Dependencies

```bash
docker-compose exec app composer install
docker-compose exec client npm install
```

## Setup Database

```bash
docker-compose exec app php artisan migrate --seed
```

Your app is now live at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

---

# 🏗️ Architecture Overview

AuthPanel uses a multi-container architecture to ensure complete isolation and portability.

| Service | Container Name | Port (Local:Internal) | Description |
|---|---|---|---|
| App | `authpanel-api` | `9000` | PHP 8.2-FPM running Laravel |
| Nginx | `authpanel-nginx` | `8000:80` | Web server directing traffic to Laravel |
| DB | `authpanel-db` | `3307:3306` | MySQL 8.0 Database |
| Client | `authpanel-client` | `5173:5173` | Vite + React (with HMR enabled) |

---

# 🔧 Environment Configuration

To allow containers to communicate, the following variables in your `server/.env` are critical:

```env
DB_CONNECTION=mysql
DB_HOST=db             # Must match the service name in docker-compose.yml
DB_PORT=3306           # Internal Docker port
DB_DATABASE=authpanel_db
DB_USERNAME=root
DB_PASSWORD=root
```

---

# 📂 Custom Installation Path (Drive D:)

If your `C:` drive is full, you can move the Docker data storage to another drive.

## Stop Docker Desktop

Close Docker Desktop completely before proceeding.

## Export/Import WSL Data

Refer to the internal screenshot for the command-line setup:

```txt
docs/assets/docker_installer_config.png
```

## Change Disk Image Location

Go to:

```txt
Settings > Resources > Advanced
```

Then set the disk image location to:

```txt
D:\Docker-Data
```

---

# 🛠️ Common Commands Reference

| Action | Command |
|---|---|
| Stop All Containers | `docker-compose down` |
| View Logs (Real-time) | `docker-compose logs -f` |
| Run Artisan Commands | `docker-compose exec app php artisan <command>` |
| Clean Docker System | `docker system prune` |
| Reset Database | `docker-compose exec app php artisan migrate:fresh --seed` |

---

# ⚠️ Troubleshooting

## Port 3306 is Taken

We mapped MySQL to port `3307` on your host to avoid conflicts with local MySQL installations.

## Connection Refused

If Laravel can't see the DB, ensure `DB_HOST` is set to:

```env
DB_HOST=db
```

and **not**:

```env
DB_HOST=127.0.0.1
```

## Changes Not Reflecting

Run the following command if Vite's Hot Module Replacement (HMR) hangs:

```bash
docker-compose restart client
```
