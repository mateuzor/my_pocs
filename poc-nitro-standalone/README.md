# poc-nitro-standalone

Learning **Nitro** as a *standalone* server engine — no Nuxt, no frontend.
Nitro is the open server toolkit that powers Nuxt 3, but it runs perfectly on
its own: you get file-based routing, storage, caching, and "deploy anywhere"
builds out of a single `server/` folder + `nitro.config.ts`.

## What is Nitro?

> A framework-agnostic server engine that builds your backend once and deploys
> it to Node, Deno, Bun, Cloudflare Workers, Vercel, Netlify, static hosting,
> and ~15 more targets — from the same code.

It's built on **h3** (the tiny HTTP framework) and **unstorage** (the universal
KV layer), and uses **Rollup + esbuild** under the hood to produce a tiny,
self-contained output.

## How it works (the mental model)

1. **The filesystem is the router.** Files under `server/routes` and
   `server/api` become URLs. `[id]` = dynamic segment, `.get`/`.post` = method.
2. **Auto-imports.** `defineEventHandler`, `useStorage`, `getQuery`, and your
   own `server/utils/*` are available without imports.
3. **Config, not plumbing.** Storage backends, caching, CORS, redirects, and
   prerendering are declared in `nitro.config.ts` (`storage`, `routeRules`,
   `prerender`), not wired by hand.
4. **Presets decouple code from target.** `NITRO_PRESET=...` decides how the
   build is packaged. Your handlers never change.

## Run it

```bash
npm install
npm run dev        # dev server at http://localhost:3000
npm run build      # production build -> .output/
npm run preview    # run the built server
npm test           # vitest
```

## Tour of this POC

| Concept | Where |
| --- | --- |
| File-based routing + query | `server/routes/index.ts`, `hello.ts` |
| Nested API, dynamic params, methods | `server/api/**` |
| Body parsing + typed errors | `server/api/todos/index.post.ts` |
| Middleware (logging, CORS) | `server/middleware/*` |
| Storage (useStorage) + fs driver | `server/lib/todos-store.ts`, `nitro.config.ts` |
| Response caching | `server/routes/expensive.ts` |
| Plugins + lifecycle hooks | `server/plugins/startup.ts` |
| Runtime config + env | `server/routes/config.get.ts` |
| Cookies / headers / redirects | `server/routes/session.get.ts`, `old-home.ts` |
| Route rules + prerender | `nitro.config.ts` |
| Tasks (cron) | `server/tasks/cleanup.ts` |
| SSE + streaming | `server/routes/events.get.ts`, `stream.get.ts` |
| Deploy presets | `docs/deploy-*.md` |
| OpenAPI | `docs/openapi.md` |

## Pros

- **Deploy anywhere** from one codebase (the standout feature).
- **Zero-config DX**: file routing, auto-imports, hot reload, typed routes.
- **Universal storage & cache** — swap backends via config, not code.
- **Tiny, dependency-light output**; fast cold starts on the edge.
- **Web-standard** request/response, so it runs on edge runtimes natively.

## Cons / trade-offs

- **Younger ecosystem** than Express/Fastify; fewer battle-tested middlewares.
- Some features (**tasks, OpenAPI**) are still **experimental**.
- **Auto-import magic** can feel implicit and hurts grep-ability for newcomers.
- Docs assume Nuxt context in places; standalone paths are less documented.
- Edge presets impose **Web-API-only** constraints (no arbitrary Node APIs).

## When to use it

Reach for Nitro when you want a modern, portable backend that can start on
Node and later move to the edge without a rewrite — APIs, BFFs, webhooks,
lightweight services. If you need a huge mature middleware ecosystem today,
Express/Fastify may still fit better.
