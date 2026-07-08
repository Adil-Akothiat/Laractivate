# 🐳 Docker Infrastructure Setup Guide

This guide ensures your host development environment is optimally configured to run the Laractivate boilerplate.

---

## 1. System Requirements & Installation

Rather than reinventing the wheel, please follow the official, up-to-date instructions to install **Docker Desktop** or **Docker Engine** for your specific operating system:

* 🪟 [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/) *(Requires WSL2 or Hyper-V enablement)*
* 🍏 [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/) *(Supports both Apple Silicon and Intel chips)*
* 🐧 [Docker Engine for Linux](https://docs.docker.com/desktop/install/linux-install/) *(Make sure to complete the [Post-installation steps](https://docs.docker.com/engine/install/linux-postinstall/) to run docker without sudo)*

---

## 2. Platform-Specific Optimization

### 🪟 Windows Setup (Crucial)
To prevent extreme slowdowns when running Laravel and React inside containers, you **must use the WSL2 (Windows Subsystem for Linux) backend**.

1. Open Docker Desktop Settings.
2. Navigate to **General** -> Check **Use the WSL 2 based engine**.
3. For maximum file system performance, **clone this repository inside your WSL2 Linux file system** (e.g., `\\wsl$\Ubuntu\home\username\projects`), *not* on your local Windows `C:\` drive.

### 🍏 Mac Setup
* Ensure **VirtioFS** is enabled under *Settings -> Virtualization* for near-native file sharing speeds between your Mac host and the containers.

---

## 3. Troubleshooting & Common Roadblocks

### 🛑 Error: "Port 3306 or 8000 is already allocated"
If you are running a local copy of MySQL or PHP natively on your host computer, Docker will fail to bind the ports.

* **The Fix:** Open your `.env` file and look for custom port bindings (or change the external port mapping inside your `docker-compose.yml` file to `3307:3306`).

### 🐌 App is running extremely slow on Windows
This happens when Docker is forced to cross-mount files between the Windows NTFS file system and Linux containers.
* **The Fix:** Move your project directory into your WSL2 home directory.

### 🔒 Permission Denied on Linux (`/var/run/docker.sock`)
If your terminal window complains about system permissions, your user group is out of sync.
* **The Fix:** Run `sudo usermod -aG docker $USER` and restart your terminal window.