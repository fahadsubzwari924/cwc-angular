# CWC — Staff web app (Angular)

Internal **Customize With Class** operator UI: products, customers, orders, order sources, and reports.

## Quick start

```bash
npm install
npm start
```

Open `http://localhost:4200/`. Set the API URL in **`src/environments/environment.ts`** (`baseUrl` must include `/api/v1`).

## Documentation

| Doc | Purpose |
|-----|---------|
| [`AGENTS.md`](AGENTS.md) | Setup, commands, layout — **start here for devs & AI agents** |
| [`docs/PROJECT_OVERVIEW.md`](docs/PROJECT_OVERVIEW.md) | Business context |
| [`docs/FRONTEND_SPEC.md`](docs/FRONTEND_SPEC.md) | Routing, auth, HTTP, features |
| [`docs/DEPLOYMENT_SETUP.md`](docs/DEPLOYMENT_SETUP.md) | Deployment |

**API repo:** `nest-server` (sibling) — REST contract and OpenAPI live there.

## Build

```bash
npm run build
```

This project was generated with [Angular CLI](https://github.com/angular/angular-cli); see Angular docs for `ng generate` and testing options.
