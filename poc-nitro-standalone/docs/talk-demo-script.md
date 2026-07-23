# Nitro.js — 5-minute talk & demo script

A tight run of order for the presentation. Total ~5 min.

## 0:00 — Hook (30s)
"Write your backend once, deploy it to Node, Cloudflare, Vercel, Deno, or a
static host — without changing a line. That's Nitro, the engine under Nuxt 3,
running standalone."

## 0:30 — What it is (45s)
- Framework-agnostic **server engine**.
- Built on **h3** (HTTP) + **unstorage** (KV) + Rollup/esbuild.
- Powers Nuxt, but works alone for APIs / BFFs / webhooks.

## 1:15 — How it works, live (2 min)
1. `npm run dev` → show the route list banner.
2. Open `server/routes/hello.ts` → hit `/hello?name=Mateus`. *Filesystem is
   the router; return value auto-serializes to JSON.*
3. Open `server/api/todos/` → show `.get.ts` / `.post.ts`. *Method routing by
   filename; `readBody` + `createError` for validation.*
4. Show `nitro.config.ts` `storage` block → `useStorage("todos")`. *Swap
   `fs` → `redis`/`cloudflare-kv` with zero code change.*

## 3:15 — The killer feature: presets (1 min)
- `NITRO_PRESET=node_server npm run build` → `.output/`, run with plain Node.
- Same code: `NITRO_PRESET=cloudflare_module` / `vercel` / `static`.
- "Code stays identical; the *build target* decides packaging."

## 4:15 — Pros / cons (30s)
- **Pros:** deploy-anywhere, zero-config DX, universal storage/cache, tiny
  output, edge-native.
- **Cons:** younger ecosystem, some experimental features, auto-import magic,
  Nuxt-centric docs, edge = Web-APIs only.

## 4:45 — Close (15s)
"Nitro is the portable backend: start on Node, move to the edge later, no
rewrite. Great fit for modern APIs."

---

## Cheatsheet (keep on screen for Q&A)

| Feature | One-liner |
| --- | --- |
| Routing | Files in `server/routes` & `server/api`; `[id]`, `.get`/`.post` |
| Handlers | `defineEventHandler(event => ...)`, return value = JSON |
| Body/errors | `readBody`, `createError`, `setResponseStatus` |
| Storage | `useStorage("ns")`, driver set in config |
| Cache | `cachedEventHandler`, `routeRules.cache` |
| Config | `useRuntimeConfig()` + `NITRO_*` env |
| Deploy | `NITRO_PRESET=...`, 15+ targets |
| Experimental | tasks, OpenAPI |
