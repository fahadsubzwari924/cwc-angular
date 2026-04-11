# Domain model — cvc-angular (summary)

The **system of record** for entities is the **API and PostgreSQL** in `nest-server`. This file gives **UI-facing** context only; keep it aligned with backend changes.

## Authoritative spec

**`nest-server/docs/DOMAIN_MODEL.md`** — tables, relationships, enums, and invariants.

## Concepts the UI must respect

- **Customer:** Person placing orders; includes **province** (used in reports).
- **Product:** Catalog item with cost, weight, optional image URL.
- **Order:** Header (amount, payment method, description, status, dates, weight) + **line items** with **per-line** `color` and `customizeName`.
- **Order source:** Channel (e.g. Instagram, Facebook, web); orders reference **one or more** sources for attribution.
- **Order status:** Lifecycle includes pending → vendor → dispatched → delivered (and returned).

## Angular models

Feature modules define TypeScript models (e.g. `modules/order/models/order.model.ts`) that map API JSON into classes. When DTOs change on the server, update **models** and **forms** in the same PR (or follow-up) to avoid silent drift.
