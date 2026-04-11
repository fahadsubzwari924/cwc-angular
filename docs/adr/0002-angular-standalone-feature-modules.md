# ADR 0002: Angular standalone components and lazy feature modules

- **Status:** Accepted
- **Date:** 2026-04-12

## Context

Angular 19 encourages **standalone** APIs; the codebase mixes a shell layout with **lazy-loaded** feature routes.

## Decision

Use **standalone** components with explicit `imports` arrays and **`loadChildren`** returning `import().then(m => m.*Routes)` for feature areas (`dashboard`, `product`, `customers`, `order`, `order-source`, `reports`).

## Consequences

- **Positive:** Features are **boundary-separated**; bundle size improves via lazy loading.
- **Negative:** No single `SharedModule`; shared pieces live under **`shared/`** and are imported per component — follow existing patterns when adding widgets.

## Alternatives considered

- **NgModule-based feature modules:** Older style; inconsistent with current code.
