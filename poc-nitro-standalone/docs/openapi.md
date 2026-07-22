# OpenAPI (experimental)

With `experimental.openAPI: true`, Nitro generates an OpenAPI 3 spec from your
file-based routes automatically — no decorators, no hand-written schema files:

- `GET /_openapi.json` — the raw spec
- `GET /_docs/scalar` — interactive Scalar UI
- `GET /_docs/swagger` — Swagger UI

Enrich a route's docs with `defineRouteMeta`:

```ts
defineRouteMeta({
  openAPI: {
    summary: "List todos",
    tags: ["todos"],
  },
});
export default defineEventHandler(() => todoStore.list());
```
