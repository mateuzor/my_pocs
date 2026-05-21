# Fresh POC

A proof-of-concept exploring [Fresh](https://fresh.deno.dev/), the official web
framework for [Deno](https://deno.com). Built as a learning exercise — every
file is heavily commented so it doubles as documentation.

## What is Fresh?

Fresh is a server-first web framework maintained by the Deno team
(Luca Casonato et al.). Its philosophy:

- **SSR by default, zero JS by default.** A page is just HTML unless you opt
  into interactivity.
- **Islands architecture.** Interactive widgets are isolated under
  `islands/` — only the JavaScript for the islands you actually use is shipped
  to the browser. Static content stays static.
- **File-based routing.** The file's path under `routes/` *is* the URL. No
  router config, no manual registration.
- **Deno-native.** No `node_modules`, no `package.json`, no build step in
  development. Dependencies are URLs imported directly. Deno executes
  TypeScript without compilation.

## How does it compare to other SSR frameworks?

| | Fresh | Next.js | Astro | Remix |
|---|---|---|---|---|
| Runtime | Deno | Node / Edge | Node / Bun / Deno | Node / Bun |
| UI library | Preact only | React only | Any (React/Vue/Svelte/Solid/Preact) | React only |
| Build in dev | None — Deno runs TS directly | Required | Required (Vite) | Required (Vite) |
| Default rendering | SSR, zero JS | RSC + Client Components | SSG/SSR, zero JS | SSR with hydration |
| Interactivity model | Islands (folder convention) | `'use client'` boundaries | Islands (`client:*` directives) | Full hydration |
| Routing | `routes/` files | `app/` with conventions | `pages/` files | `routes/` with file conventions |
| Middleware | `_middleware.ts` per folder | `middleware.ts` root only | Single chain | Loaders/actions |

**Quick guide on when to pick Fresh:** small to mid-sized projects that already
live in the Deno ecosystem, edge deploys (Deno Deploy is its natural home),
and cases where you want minimal tooling and a zero-config dev experience.

## Project structure

```
poc-fresh/
├── deno.json           # Tasks, import map, compiler options
├── main.ts             # Production entry — start(manifest, config)
├── dev.ts              # Dev entry with watch mode
├── fresh.config.ts     # Plugins, listen options
├── routes/             # File-based routing — every file is a URL
│   ├── _app.tsx        # Root HTML wrapper (applies to every page)
│   ├── _middleware.ts  # Root middleware — runs on every request
│   ├── index.tsx       # /
│   ├── about.tsx       # /about
│   ├── counter.tsx     # /counter — uses a single island
│   ├── islands-demo.tsx# /islands-demo — multiple islands + signals
│   ├── comparison.tsx  # /comparison — static SSR comparison table
│   ├── blog/
│   │   ├── _layout.tsx # Scoped layout (sidebar) for /blog/*
│   │   ├── index.tsx   # /blog
│   │   └── [slug].tsx  # /blog/:slug (dynamic route)
│   ├── products/
│   │   └── index.tsx   # /products — GET handler + POST form
│   ├── admin/
│   │   ├── _middleware.ts # Scoped auth middleware
│   │   └── index.tsx   # /admin (protected)
│   └── api/
│       └── random.ts   # /api/random — JSON-only endpoint
├── islands/            # The magic folder — interactive Preact components
│   ├── Counter.tsx     # useState-based, isolated state per instance
│   ├── Search.tsx      # Accepts serializable props
│   └── SharedCounter.tsx # Reads/writes a module-level signal
├── components/         # Static, server-only Preact components
├── plugins/
│   └── banner.ts       # Custom Fresh plugin (injects scripts)
└── static/             # Served as-is at the matching URL
    ├── styles.css      # → /styles.css
    ├── logo.svg        # → /logo.svg
    └── robots.txt      # → /robots.txt
```

## The four core ideas

### 1. File-based routing

The path of the file under `routes/` is the URL. Adding a route is creating a
file — no router configuration is needed.

```
routes/index.tsx             →  /
routes/about.tsx             →  /about
routes/blog/index.tsx        →  /blog
routes/blog/[slug].tsx       →  /blog/:slug
routes/[...path].tsx         →  catch-all
routes/api/users.ts          →  /api/users  (JSON endpoint, no UI)
```

Underscore-prefixed files are special:

- `_app.tsx` — root wrapper (HTML doc, head, body)
- `_layout.tsx` — folder-scoped wrapper (shared sidebar, header, etc.)
- `_middleware.ts` — runs before every request in its folder

### 2. SSR by default, zero JS by default

A typical Fresh page renders to plain HTML on the server. The browser receives
that HTML and... that's it. No hydration script. No framework bundle. No client-
side JavaScript at all unless you explicitly import an island.

This is a stark contrast to a typical React SPA where even a single interactive
button means downloading React + ReactDOM + your entire component tree.

In this POC, `/about`, `/blog`, `/comparison` ship **0 bytes of JS**. Pages
that use islands (`/counter`, `/islands-demo`) ship only the JS for the
specific islands they use.

### 3. Islands architecture

Anything under `islands/` is:

1. Server-rendered to static HTML for the initial paint.
2. Compiled into a separate JS chunk.
3. Sent to the browser **only on pages that import it**.
4. Hydrated **independently** from other islands on the same page.

Islands look like normal Preact components — they use `useState`, `useEffect`,
event handlers, etc. The framework figures out where to draw the
client/server boundary by looking at where the file lives.

**Important:** props passed to islands must be JSON-serializable. They get
embedded in the HTML as a data attribute and rehydrated on the client. No
functions, no class instances, no `Date` objects (without conversion).

For shared state across islands, use **Preact Signals** declared at module
scope:

```tsx
// islands/SharedCounter.tsx
import { signal } from "@preact/signals";

const sharedCount = signal(0);   // shared by every instance of this module

export default function SharedCounter() {
  return <button onClick={() => sharedCount.value++}>{sharedCount}</button>;
}
```

### 4. Server-side data loading with `handler`

A route file can export both a default component (the UI) and a `handler`
object with HTTP method handlers:

```tsx
// routes/products/index.tsx
export const handler: Handlers<Data> = {
  GET(req, ctx) {
    return ctx.render({ products: PRODUCTS });   // pass data to the component
  },
  async POST(req, ctx) {
    const form = await req.formData();
    PRODUCTS.push(parseProduct(form));
    return ctx.render({ products: PRODUCTS });   // re-render after mutation
  },
};

export default function ProductsPage({ data }: PageProps<Data>) {
  return <ul>{data.products.map(...)}</ul>;
}
```

This is conceptually similar to:

- Next.js: `getServerSideProps` (Pages Router) or Server Components + Server
  Actions (App Router)
- Astro: frontmatter at the top of `.astro` files
- Remix: `loader` and `action` exports

**HTML forms work without JavaScript.** A `<form method="POST">` triggers a
full-page navigation that runs the `POST` handler — progressive enhancement
out of the box.

### 5. Middleware

`_middleware.ts` runs on every request matching its folder.

- `routes/_middleware.ts` runs on every request in the entire app (logging,
  request IDs, headers).
- `routes/admin/_middleware.ts` runs only for `/admin/*` (auth check).

Middleware receives the standard `Request` plus a Fresh `ctx` and either calls
`ctx.next()` to continue the chain or returns its own `Response` to
short-circuit.

```ts
export async function handler(req: Request, ctx: FreshContext) {
  if (!isAuthenticated(req)) {
    return new Response("Unauthorized", { status: 401 });
  }
  return ctx.next();
}
```

### 6. Static files

Anything under `static/` is served at the matching URL — no build step, no
manifest entries, no copy step. Drop `static/logo.svg` and it's available at
`/logo.svg` immediately.

### 7. Plugins

Plugins extend the framework. They can inject scripts/styles into rendered
pages, add middleware, register routes, or expose islands. Registered in
`fresh.config.ts`:

```ts
import { defineConfig } from "$fresh/server.ts";
import { bannerPlugin } from "./plugins/banner.ts";

export default defineConfig({
  plugins: [bannerPlugin],
});
```

Real-world plugins: `fresh-tailwind`, `twind`, `fresh-seo`, `@deno/blog`.

## Running this POC

Fresh requires Deno installed:

```bash
curl -fsSL https://deno.land/install.sh | sh
```

Then:

```bash
# Development with HMR
deno task start

# Production build
deno task build
deno task preview

# Regenerate fresh.gen.ts manifest
deno task manifest
```

The dev server runs at `http://localhost:8000` by default. Routes worth
visiting:

- `/` — overview with links to every demo
- `/blog/intro-to-fresh` — nested layout + dynamic route
- `/counter` — single island
- `/islands-demo` — multiple islands, isolated state, shared signals
- `/products` — GET handler + POST form
- `/admin` — protected route (send `Authorization: Bearer admin-token`)
- `/comparison` — Fresh vs Next.js vs Astro
- `/swagger` — N/A (Swagger is in the Elysia POC, not this one)

## Further reading

- [Official docs](https://fresh.deno.dev/docs/introduction)
- [The Deno blog post explaining islands](https://deno.com/blog/the-future-and-past-is-server-side-rendering)
- [Fresh GitHub repo](https://github.com/denoland/fresh)
