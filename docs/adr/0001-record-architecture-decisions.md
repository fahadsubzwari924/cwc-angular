# ADR 0001: Record architecture decisions

- **Status:** Accepted
- **Date:** 2026-04-12

## Context

The SPA will gain features (orders, reports, auth flows). Without a log, UI conventions become tribal knowledge.

## Decision

Maintain **ADRs** under `docs/adr/` for decisions that affect structure, data flow, or integration with the API.

## Consequences

- **Positive:** Frontend and full-stack contributors share explicit rationale.
- **Negative:** Keep ADRs short; defer API-only decisions to `nest-server/docs/adr/`.
