
---

# 📄 New `docs/docker/doc.md`

```md
# 🐳 Docker Setup Guide

This project is fully Dockerized and works across Windows, macOS, and Linux.

---

# 📌 Supported Platforms

| Platform | Requirements |
| :--- | :--- |
| Windows | Docker Desktop |
| macOS | Docker Desktop |
| Linux | Docker Engine + Docker Compose |

---

# 🪟 Windows Notes (Optional WSL2)

WSL2 is **not required** to run this project.

However, it may improve:

- Docker performance
- File synchronization
- Vite hot reload stability

👉 Optional WSL2 installation:  
https://learn.microsoft.com/en-us/windows/wsl/install

---

# 🐳 Docker Desktop Installation (Windows)

During installation, recommended settings:

- ✅ Install for all users
- ❌ WSL2 backend (optional)
- ❌ Windows containers

👉 Docker Desktop:  
https://www.docker.com/products/docker-desktop/

---

# ⚙️ Docker Commands

## Start containers

```bash
docker-compose up -d --build