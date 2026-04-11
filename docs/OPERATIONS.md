# Operations — cvc-angular

## Environment configuration

Edit **`src/environments/environment.ts`** (and **`environment.prod.ts`** for production builds):

| Field | Purpose |
|-------|---------|
| `production` | Angular build mode flag |
| `baseUrl` | Full REST prefix including **`/api/v1`** |

Example local value: `http://localhost:3000/api/v1`.

The checked-in default may point at a **hosted** API; override for local development.

## Commands

```bash
npm install
npm start          # dev server, default http://localhost:4200
npm run build      # output in dist/
npm test
```

## Deployment

See **[`DEPLOYMENT_SETUP.md`](DEPLOYMENT_SETUP.md)** in this folder.

## Backend dependency

The UI expects the **nest-server** API to be running and reachable at `baseUrl`. API env vars, migrations, and health checks: **`nest-server/docs/OPERATIONS.md`**.
