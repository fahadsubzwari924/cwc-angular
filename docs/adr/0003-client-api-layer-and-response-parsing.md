# ADR 0003: Centralized API client and defensive response parsing

- **Status:** Accepted
- **Date:** 2026-04-12

## Context

All HTTP calls must target the same **base URL** and attach **JWT** consistently. The backend wraps responses in a **generic envelope** (`payload` / `metadata`).

## Decision

- Route HTTP through **`ApiService`** (`shared/services/api.service.ts`).
- Use **`ApiPaths`** for path segments.
- In domain services, parse **`response?.data ?? response?.payload`** where both shapes have appeared historically.

## Consequences

- **Positive:** One place to add interceptors (e.g. global 401) later; consistent headers.
- **Negative:** Defensive `data`/`payload` merge can hide contract drift — prefer tightening the contract in **`nest-server`** and then simplifying clients.

## Related

- Backend: **`nest-server/docs/adr/0003-http-response-envelope-via-interceptor.md`**
