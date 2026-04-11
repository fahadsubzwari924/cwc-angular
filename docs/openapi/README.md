# OpenAPI (reference)

OpenAPI artifacts are **owned by the API repository**.

- **Envelope + shared schemas:** `nest-server/docs/openapi/openapi.yaml`
- **Generation instructions and JSON snapshot:** `nest-server/docs/openapi/README.md`
- **Live docs** (when API is running): Swagger at `{API_ORIGIN}/api`, JSON at `{API_ORIGIN}/api-json`

The Angular app does not generate OpenAPI; it **consumes** the API per `docs/API_CONTRACT.md`.
