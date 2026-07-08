# ⚙️ Environment Variables

This is the full reference for every variable in `.env.example`. Copy the file first:

```bash
cp .env.example .env
```

Then work through the **Required** section below — that's the minimum needed to get the project running. Everything else has a working default and can be left alone until you actually need it.

---

## 🚀 Required — Change Before You Run

These are the only variables you *must* look at to boot the project.

| Variable       | Default                  | Notes                                                                 |
| :------------- | :------------------------ | :---------------------------------------------------------------------|
| `APP_NAME`     | `Laractivate`             | Used in emails, page titles, etc.                                    |
| `APP_ENV`      | `local`                   | Leave as `local` for development.                                    |
| `APP_KEY`      | *(empty)*                 | **Required.** Generate with `php artisan key:generate --show` — see [main Quick Start](../README.md#5-generate-application-keys-). |
| `APP_DEBUG`    | `true`                    | Set to `false` in production.                                        |
| `APP_URL`      | `http://localhost:8000`   | Backend URL.                                                          |
| `FRONTEND_URL` | `http://localhost:5173`   | Vite dev server URL.                                                  |
| `DB_CONNECTION`| `mysql`                   | Pre-configured for Docker.                                            |
| `DB_HOST`      | `db`                      | Matches the Docker Compose service name — don't change unless you rename the service. |
| `DB_PORT`      | `3306`                    | —                                                                      |
| `DB_DATABASE`  | `laractivate_db`          | —                                                                      |
| `DB_USERNAME`  | `root`                    | —                                                                      |
| `DB_PASSWORD`  | `root`                    | Change for anything beyond local dev.                                 |

---

## 🔐 Authentication & Security (JWT / Cookies)

| Variable                  | Default                          | Notes                                                        |
| :------------------------- | :--------------------------------- | :-------------------------------------------------------------|
| `JWT_SECRET`               | *(empty)*                          | **Required.** Generate with `php artisan jwt:secret --show` — see [main Quick Start](../README.md#5-generate-application-keys-). Without it, login won't work. |
| `JWT_TTL`                  | `25`                               | Access token lifetime, in minutes.                            |
| `JWT_REFRESH_TTL`          | `10080`                            | Refresh token lifetime, in minutes (default = 7 days).        |
| `JWT_BLACKLIST_ENABLED`    | `true`                             | Invalidates tokens on logout.                                 |
| `COOKIE_KEY_ACCESS_TOKEN`  | `laractivate_access_token`         | Cookie name for the access token.                              |
| `COOKIE_KEY_REFRESH_TOKEN` | `laractivate_refresh_token`        | Cookie name for the refresh token.                             |
| `COOKIE_TTL`                | `30`                               | Cookie lifetime, in minutes.                                   |
| `BCRYPT_ROUNDS`             | `12`                               | Password hashing cost factor.                                  |

---

## 💳 Stripe & Billing

Only needed if your app uses payments/subscriptions. Full setup walkthrough: **[docs/billing.md](./billing.md)**.

| Variable                   | Default          | Notes                                             |
| :--------------------------- | :----------------- | :---------------------------------------------------|
| `STRIPE_KEY`                | `your_pk_test_...` | Publishable key from your Stripe dashboard.        |
| `STRIPE_SECRET`             | `your_sk_test_...` | Secret key from your Stripe dashboard.             |
| `STRIPE_WEBHOOK_SECRET`     | `your_whsec_...`   | Captured from the Stripe CLI — see billing doc.    |
| `STRIPE_PRICE_PRO`          | `price_...`        | Price ID for your Pro tier.                        |
| `STRIPE_PRICE_ENTERPRISE`   | `price_...`        | Price ID for your Enterprise tier.                 |
| `CASHIER_CURRENCY`          | `usd`               | Default billing currency.                          |
| `CASHIER_MODEL`             | `App\Models\User`  | Model that owns subscriptions.                     |
| `STRIPE_TEST_CLOCK_ID`      | `clock_...`         | Optional — for simulating time-based billing in tests. |

---

## 📧 Mail

Defaults to `log` so no external credentials are needed for local dev — outgoing mail just gets written to the log file.

| Variable            | Default                | Notes                                   |
| :-------------------- | :------------------------ | :------------------------------------------|
| `MAIL_MAILER`        | `log`                     | Switch to `smtp` (or another driver) for real delivery. |
| `MAIL_HOST`          | `127.0.0.1`               | —                                        |
| `MAIL_PORT`          | `2525`                    | —                                        |
| `MAIL_SCHEME`        | `null`                    | —                                        |
| `MAIL_USERNAME`      | `null`                    | —                                        |
| `MAIL_PASSWORD`      | `null`                    | —                                        |
| `MAIL_FROM_ADDRESS`  | `hello@example.com`       | —                                        |
| `MAIL_FROM_NAME`     | `"${APP_NAME}"`           | Inherits from `APP_NAME`.                |

---

## ☁️ External Integrations (AWS / Storage)

Only needed if you're using S3-compatible storage.

| Variable                     | Default       | Notes                          |
| :----------------------------- | :--------------- | :---------------------------------|
| `AWS_ACCESS_KEY_ID`          | *(empty)*        | —                                |
| `AWS_SECRET_ACCESS_KEY`      | *(empty)*        | —                                |
| `AWS_DEFAULT_REGION`         | `us-east-1`      | —                                |
| `AWS_BUCKET`                 | *(empty)*        | —                                |
| `AWS_USE_PATH_STYLE_ENDPOINT`| `false`          | Set `true` for MinIO or similar. |

---

## 🧩 Internal Infrastructure & Drivers

Standard Laravel defaults. Usually left untouched during local setup.

| Variable                    | Default        |
| :----------------------------- | :--------------- |
| `APP_LOCALE`                 | `en`             |
| `APP_FALLBACK_LOCALE`        | `en`             |
| `APP_FAKER_LOCALE`           | `en_US`          |
| `APP_MAINTENANCE_DRIVER`     | `file`           |
| `SESSION_DRIVER`             | `database`       |
| `SESSION_LIFETIME`           | `120`            |
| `SESSION_ENCRYPT`            | `false`          |
| `SESSION_PATH`               | `/`              |
| `SESSION_DOMAIN`             | `null`           |
| `CACHE_STORE`                | `database`       |
| `FILESYSTEM_DISK`            | `local`          |
| `QUEUE_CONNECTION`           | `database`       |
| `BROADCAST_CONNECTION`       | `log`            |
| `REDIS_CLIENT`               | `phpredis`       |
| `REDIS_HOST`                 | `127.0.0.1`      |
| `REDIS_PASSWORD`             | `null`           |
| `REDIS_PORT`                 | `6379`           |
| `MEMCACHED_HOST`             | `127.0.0.1`      |
| `LOG_CHANNEL`                | `stack`          |
| `LOG_STACK`                  | `single`         |
| `LOG_DEPRECATIONS_CHANNEL`   | `null`           |
| `LOG_LEVEL`                  | `debug`          |
| `VITE_APP_NAME`              | `"${APP_NAME}"`  |

---

⬅ [Back to main README](../README.md)