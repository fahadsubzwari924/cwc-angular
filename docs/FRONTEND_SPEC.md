# Frontend specification — cvc-angular

Detailed **UI and client** behavior for contributors and coding agents.

## Application bootstrap

- **`src/main.ts`** bootstraps `App` with `appConfig` from **`src/app/app.config.ts`**.
- **Router:** `appRoutes` from **`src/app/app-routing.ts`** — `withPreloading(NoPreloading)`.
- **Global providers:** `provideHttpClient`, `provideAnimations`, `providePrimeNG` (Aura), `AuthGuard`, `MessageService`, `DialogService`.

## Routing

| URL | Guard | Notes |
|-----|-------|--------|
| `''` (children) | `AuthGuard` | Wrapped in `LayoutComponent` |
| `/dashboard` | ✓ | Lazy `dashboard.routes` |
| `/products` | ✓ | Lazy `product.routes` |
| `/customers` | ✓ | Lazy `customers.routes` |
| `/orders` | ✓ | Lazy `order.routes` — list at `''`, create `/create`, edit `/:orderId/edit` |
| `/order-sources` | ✓ | Lazy `order-source.routes` |
| `/reports` | ✓ | Lazy `reports.routes` |
| `/login` | — | `LoginComponent` |
| `**` | — | Redirect to `/login` |

**Unused route asset:** `root-components/register/` exists but **`RegisterComponent` is not registered** in `app-routing.ts`.

## Authentication

- **`AuthService`** (`core/services/auth.service.ts`): `signIn`, `setSession`, `clearSession`, `getStoredToken`, `getStoredUser`.
- **`AuthGuard`** (`core/guards/auth.guard.ts`): redirects to `/login` if no token.
- Login response normalized from `response.payload` or `response.data` into **`LoginResponse`** model.

## HTTP layer

- **`ApiService`** (`shared/services/api.service.ts`): builds URLs with `environment.baseUrl`, attaches Bearer token, supports `FormData` via `isFormData` flag.
- **`ApiPaths`** (`shared/enums/api-paths.ts`): `/products`, `/customers`, `/orders`, `/auth`, `/reports`, `/reports/dashboard/stats`, `/order-sources`.

Domain services (e.g. **`modules/order/services/order.service.ts`**) wrap `ApiService` and map responses into **model classes**.

## Layout and navigation

- **`LayoutComponent`:** sidebar, topbar, footer, menu; `LayoutService` for UI state (menu mode, dark/light).
- **`MenuComponent`:** static menu model linking to dashboard, products, customers, orders, order sources, reports.

## Feature highlights

| Area | Location | Notes |
|------|----------|--------|
| Orders | `modules/order/` | **CreateOrderV2Component** is primary create/edit UX; subcomponents for product search, cards, summary, order info form |
| Reports | `modules/reports/` | Data services + ECharts wrappers in `shared/components/` |
| Products | `modules/product/` | List, create, edit |
| Customers | `modules/customers/` | Create, edit |

## Styling

- Global styles: **`src/styles.scss`**
- Layout SCSS under **`src/assets/layout/styles/`**
- PrimeFlex utility classes used alongside PrimeNG components

## Conventions for changes

- Prefer **standalone** `imports` on components already using that style.
- Use **`inject()`** for DI in new code where neighboring files do.
- Reuse **`ApiService`**; do not hardcode API origins in components.
- After API contract changes, update **`nest-server`** docs and **`docs/API_CONTRACT.md`** pointers, then adjust models and services here.
