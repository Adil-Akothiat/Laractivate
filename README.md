# 📦 Laractivate Boilerplate

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
git clone https://github.com/Adil-Akothiat/Laractivate.git
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
> ⏳ The first build may take a few minutes.

### 4. Setup Database

```bash
docker-compose exec app php artisan migrate --seed
```

### 5. Application Keys Configuration 🔑

Because Laractivate uses Docker to manage environment variables, the standard `php artisan` commands cannot modify your `.env` file directly. You must generate the keys and manually add them to your root `.env` file.

#### A. Generate Laravel Application Key
The `APP_KEY` is used by Laravel to encrypt your user sessions and other sensitive data.

Run the following command:

```bash
docker-compose exec app php artisan key:generate --show
```
Copy the outputted string (e.g., `base64:abc...`).

Open your root `.env` and paste it:

```plaintext
APP_KEY=base64:your_generated_key_here
```

#### B. Generate JWT Secret
This secret is used to sign your authentication tokens. Without this, users will not be able to log in.

Run the following command:

```bash
docker-compose exec app php artisan jwt:secret --show
```
Copy the generated secret string.

Update your root `.env`:

```plaintext
JWT_SECRET=your_generated_jwt_secret_here
```

#### C. Connect and Pair Stripe CLI Webhooks 💳
Laractivate abstracts local package dependencies by hosting an official `stripe/stripe-cli` service inside Docker. This captures transaction lifecycle events from your Stripe dashboard and routes them straight to your application database.

##### 1. Link to Your Stripe Sandbox Account
Initialize the pairing process inside the temporary CLI instance container:
```bash
docker-compose run --rm stripe-cli login
```
Docker will output a unique pairing URL. Copy it, paste it into your browser, log in, and click Allow. Your configuration token session will persist securely inside the named Docker volume layer.

##### 2. Capture Your Webhook Secret Key
Now, run the temporary listener check process once to extract your local container signing secret:
```bash
docker-compose up stripe-cli
```

Look closely at the initial boot logs terminal interface. You will see a line outputted like this:
> Ready! Your webhook signing secret is whsec_...

Copy that whsec_... string token, open your root .env file, and assign it to your configuration variable key:
`STRIPE_WEBHOOK_SECRET=whsec_your_copied_secret_here`

##### 3. Boot Up the Automated Webhook Background Service
Hit `ctrl + c` to safely close the active terminal process view, then restart your core stack services inside the global background loop:

```bash
docker-compose down
```
Then
```bash
docker-compose up -d
```
**Pro Tip:** Never share your `.env` file or commit it to version control. These keys are unique to your production or local instance and are critical for security.

### 6. Verify Everything Is Running

```bash
docker-compose ps
```

All services (`app`, `client`, `db`) should show status **Up**.

---

# 📚 Documentation

## 🖥️ Backend (Laravel)

| Component           | Link                                        |
| :------------------ | :------------------------------------------ |
| Core Server Docs    | [./server/README.md](./server/README.md) |

## 💻 Frontend (React.js)

| Component           | Link                                        |
| :------------------ | :------------------------------------------ |
| Core Client Docs    | [./client/README.md](./client/README.md) |

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