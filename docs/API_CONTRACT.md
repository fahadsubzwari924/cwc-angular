# API contract — cvc-angular (integration view)

This app is a **client** of the Nest API. The **authoritative** contract documentation lives in the **backend repo**.

## Canonical references (nest-server)

| Resource | Location |
|----------|----------|
| Full HTTP contract (envelope, pagination, public routes) | `nest-server/docs/API_CONTRACT.md` |
| OpenAPI YAML (envelope + shared schemas) | `nest-server/docs/openapi/openapi.yaml` |
| OpenAPI generation / JSON snapshot | `nest-server/docs/openapi/README.md` |
| Live Swagger UI | `{API_ORIGIN}/api` (e.g. `http://localhost:3000/api`) |
| Live OpenAPI JSON | `{API_ORIGIN}/api-json` |

## How this app calls the API

- **Base URL:** `environment.baseUrl` in `src/environments/environment.ts` — must end with **`/api/v1`**.
- **Auth header:** `ApiService` adds `Authorization: Bearer <token>` when `localStorage.getItem('token')` is set.
- **Success bodies:** Prefer reading **`response.payload`**; many services also accept **`response.data`** for compatibility with the backend interceptor (`GenericResponseDto`).

## Client-specific notes

- **Login:** `POST .../auth/login` via `AuthService.signIn`; session persisted with **`token`** and **`user`** keys in `localStorage`.
- **File uploads:** Use `httpPost` with `isFormData = true` so `Content-Type` is not forced to JSON.

Before changing response handling, read **`nest-server/docs/adr/0003-http-response-envelope-via-interceptor.md`**.
