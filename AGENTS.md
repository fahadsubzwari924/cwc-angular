# AGENTS.md — cvc-angular (staff web app)

Instructions for **AI coding agents** and developers working in this repository.

## Product context

Business-oriented overview: [`docs/PROJECT_OVERVIEW.md`](docs/PROJECT_OVERVIEW.md).  
Technical specs: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), [`docs/FRONTEND_SPEC.md`](docs/FRONTEND_SPEC.md), [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md), [`docs/DOMAIN_MODEL.md`](docs/DOMAIN_MODEL.md), [`docs/SECURITY_NOTES.md`](docs/SECURITY_NOTES.md), [`docs/OPERATIONS.md`](docs/OPERATIONS.md), [`docs/adr/`](docs/adr/).

**Sibling API repo:** `nest-server` — canonical HTTP contract and OpenAPI live there (`docs/API_CONTRACT.md`, `docs/openapi/`).

## Stack

- Angular **19**, **standalone** components, `provideRouter`, `provideHttpClient`
- **PrimeNG** 19 with **Aura** preset
- **ECharts** for reports charts
- RxJS 7

## Setup

```bash
npm install
npm start
```

App defaults to `http://localhost:4200/`. Point the API at your backend by editing `src/environments/environment.ts` → **`baseUrl`** (must include `/api/v1` suffix).

## Commands

| Command | Purpose |
|--------|---------|
| `npm start` / `ng serve` | Dev server |
| `npm run build` | Production build (`dist/`) |
| `npm test` | Unit tests (Karma) |

## Layout

| Path | Role |
|------|------|
| `src/app/app.config.ts` | App providers (router, HttpClient, PrimeNG, guards) |
| `src/app/app-routing.ts` | Top-level routes, lazy feature modules |
| `src/app/core/` | Shell: layout, guards, auth service, shared layout services |
| `src/app/modules/` | Feature areas: `dashboard`, `product`, `customers`, `order`, `order-source`, `reports` |
| `src/app/shared/` | `ApiService`, reusable UI (charts, dialogs, pipes) |
| `src/app/root-components/` | Login (and register component exists but is **not** routed) |
| `src/environments/` | `baseUrl` and environment flags |

## Conventions

- **HTTP:** Use **`ApiService`** (`httpGet` / `httpPost` / `httpPut` / `httpDelete`) so `baseUrl` and **`Authorization: Bearer`** from `localStorage` are applied.
- **Paths:** Prefer **`ApiPaths`** enum for route segments.
- **Responses:** Backend wraps successes in **`payload`** (see `GenericResponseDto` on API). Client code often uses **`response?.data ?? response?.payload`** — keep parsing consistent when touching services.
- **Auth:** `AuthGuard` checks `localStorage` key **`token`**; `AuthService` also stores **`user`** as JSON.
- **Change detection:** Prefer **`ChangeDetectionStrategy.OnPush`** where already used; align with existing patterns in the file you edit.

## Testing and quality

- Run **`npm run build`** before considering UI work complete (catches template/type issues).
- Match existing **ESLint** rules for the project.

## References

- Deploy: [`docs/DEPLOYMENT_SETUP.md`](docs/DEPLOYMENT_SETUP.md)
- API details: sibling repo `nest-server/docs/API_CONTRACT.md`
