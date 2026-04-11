# Railway Frontend — One-Time Setup

Do this once before using `npm run deploy`.

## 1. Install Railway CLI

```bash
npm install -g @railway/cli
```

## 2. Log in

```bash
railway login
```

Opens the browser for Railway auth.

## 3. Link this repo to your project

From the repo root:

```bash
railway link
```

- Choose the **customize_with_class** project.
- When asked to select a service, pick your frontend service (e.g. `cvc-web`). If you don't see it, create an empty service in the Railway dashboard first, then run `railway link` again and select it. Do not link to the API or Postgres service.


## 4. Deploy

```bash
npm run deploy
```

Later deploys: run `npm run deploy` again; no need to repeat steps 1–3.

## Optional: Custom domain

In Railway Dashboard → your frontend service → **Settings** → **Networking** → add a custom domain and follow the DNS instructions.
