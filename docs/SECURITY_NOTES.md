# Security notes — cvc-angular

Browser-facing considerations for the **staff SPA**. Server-side exposure: **`nest-server/docs/SECURITY_NOTES.md`**.

## Session storage

- **JWT** is stored in **`localStorage`** under the key **`token`** (`AuthService`).
- **User profile** snapshot is stored as JSON under **`user`** for display convenience.

**Implications:** Any script running on the origin can read these values (XSS risk). Keep dependencies updated and avoid injecting untrusted HTML.

## Transport

- Use **HTTPS** in production so tokens and PII are not sent in clear text.
- Ensure `environment.baseUrl` uses **https:** against production APIs.

## Authentication gate

- **`AuthGuard`** only checks **presence** of a token, not expiry or signature validity. Expired tokens may yield **401** from the API until the user logs in again — handle errors in services or interceptors if you add global 401→logout behavior.

## No role-based UI

- The API does not expose fine-grained roles in the current model; the UI does not hide menus by permission. If RBAC is added server-side, mirror it in routing and menu config.

## CORS

- Not configured in this repo; the **API** enables CORS. Coordinate allowed origins with **`nest-server`** when locking down production.
