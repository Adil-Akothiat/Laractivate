# 💳 Billing & Stripe Setup

Laractivate ships with an official `stripe/stripe-cli` service running inside Docker. It listens for events from your Stripe dashboard (payments, subscription changes, etc.) and routes them straight to your app.

> ℹ️ **This step is optional.** The project runs fine without it. Only follow this guide if your app needs payments or subscriptions.

---

## Before You Start

Make sure you've already:
1. Copied `.env.example` to `.env` (see [main README](../README.md#2-configure-environment))
2. Run `docker-compose up -d --build`
3. Created a free [Stripe account](https://dashboard.stripe.com/register) if you don't have one

---

## 1. Add Your Stripe API Keys

From your [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys) (Test mode), copy your publishable and secret keys into `.env`:

```plaintext
STRIPE_KEY=pk_test_your_key_here
STRIPE_SECRET=sk_test_your_key_here
```

---

## 2. Link Your Stripe Sandbox Account

Initialize the pairing process inside the CLI container:

```bash
docker-compose run --rm stripe-cli login
```

Docker will output a unique pairing URL. Copy it into your browser, log in, and click **Allow**. Your session token is stored securely inside the named Docker volume, so you only need to do this once.

---

## 3. Capture Your Webhook Signing Secret

Run the listener once to extract your local webhook secret:

```bash
docker-compose up stripe-cli
```

Watch the boot logs — you'll see a line like:

```
Ready! Your webhook signing secret is whsec_...
```

Copy that `whsec_...` value into your `.env`:

```plaintext
STRIPE_WEBHOOK_SECRET=whsec_your_copied_secret_here
```

Then stop the process with `Ctrl + C`.

---

## 4. Restart Your Stack

```bash
docker-compose down
docker-compose up -d
```

This boots everything back up, including the webhook listener, running in the background this time.

---

## 5. Map Your Price IDs

Create your products/prices in the [Stripe Dashboard](https://dashboard.stripe.com/test/products), then map the resulting price IDs in `.env`:

```plaintext
STRIPE_PRICE_PRO=price_your_pro_tier_id
STRIPE_PRICE_ENTERPRISE=price_your_enterprise_tier_id
```

---

## 6. Verify

```bash
docker-compose ps
```

The `stripe-cli` service should show as **Up**. Trigger a test event from the Stripe Dashboard (or `stripe trigger payment_intent.succeeded` from inside the container) and confirm it shows up in `docker-compose logs -f stripe-cli`.

---

## ⚠️ Security

Never share your `.env` file or commit it to version control. Your Stripe keys and webhook secret are unique to your instance and give access to your payment data.

---

## Troubleshooting

| Issue | Fix |
| :------ | :----|
| No pairing URL appears after `stripe-cli login` | Make sure Docker is running and the container has internet access — check `docker-compose logs stripe-cli`. |
| `STRIPE_WEBHOOK_SECRET` missing/blank | Re-run step 3 — the secret is regenerated each time you start a fresh `stripe-cli login` session. |
| Webhooks not reaching your app | Confirm `app` and `stripe-cli` are both `Up` (`docker-compose ps`), and that `STRIPE_WEBHOOK_SECRET` matches the latest value from the logs. |
| Payments succeed in Stripe but nothing updates locally | Check `docker-compose logs -f stripe-cli` for delivery errors, and confirm your webhook route/controller is registered. |

---

⬅ [Back to main README](../README.md)