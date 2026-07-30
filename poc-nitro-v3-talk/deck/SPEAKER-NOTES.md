# Speaker notes — Nitro v3, 5-minute talk

Gerado automaticamente por `build_deck.py`. **Não edite à mão** — edite o
script e rode `python3 deck/build_deck.py`.

Fallback para quando não houver PowerPoint na máquina. O roteiro do código
está em [`../TOUR.md`](../TOUR.md).

> Blocos `— — — if asked:` **não são pra ler** — é munição para o Q&A.

---

## Slide 1 — Nitro

`[0:00 — 15s]`

Nitro. Most people meet it as "the thing under Nuxt". The interesting part is
that it stopped being a Nuxt thing.

Five minutes: what it is, how it compiles, what it costs, and a live demo.

— — — if asked: v3 went beta this year; that's the version I built the POC on.

---

## Slide 2 — A build tool for servers

`[0:15 — 25s]`

Nitro is a server toolkit, not a framework. A framework owns your request
handler. Nitro owns your build and your deploy, and leaves the handler to you.

In v3 a handler is plain web standard — Request in, Response out. That's why
it isn't just Nuxt anymore: TanStack Start, Analog and SolidStart all sit on it.

— — — if asked: you can bring Hono or Elysia as the entry and still keep all
the deployment machinery. Nothing proprietary to learn or unlearn.

---

## Slide 3 — It compiles your server

`[0:40 — 30s]`

The mental model is a compiler.

Your routes and config go in. h3 handles routing, srvx normalises the HTTP
server across runtimes, unenv polyfills the Node APIs the edge doesn't have,
and Rolldown — a Rust bundler — builds it. Out comes one self-contained folder
shaped for one platform.

Key word: compiled. Routes are resolved at build time and code-split, so
hitting slash api slash users never loads the code for posts.

— — — if asked: batteries are opt-in and tree-shaken. Don't import the SQL
layer and it isn't in your bundle. That's how 25 deps stays 25 deps.

---

## Slide 4 — One codebase, five builds

`[1:10 — 25s]`

This is the payoff, and these are numbers from my POC last night — not their
marketing page.

One command. NITRO_PRESET picks the target. Same source, five outputs.

Notice Cloudflare is smaller than Node — unenv stripped the Node compatibility
layer it doesn't need there. Each target gets its own build.

— — — if asked: ~20 presets, and it auto-detects the platform in CI, so in
practice you often set nothing at all.

---

## Slide 5 — Routing is the filename. Caching is a wrapper.

`[1:35 — 22s]   (you'll open the real files in the demo, so keep this brisk)`

Two ideas, then I'll show you the real thing.

Left: the filename is the route and the method — no registration file, so no
drift. Right: defineCachedFunction wraps any async function in a
stale-while-revalidate cache. Notice what's missing — no Redis client, no
connection string.

— — — if asked: it's backed by the storage layer, so dev writes files to disk
and production points at Redis or Workers KV by changing config, never this file.

---

## Slide 6 — Live: the whole server is seven files

`[1:57 — 110s]  >>> SWITCH TO EDITOR <<<   full script: TOUR.md`

START ./demo.sh build-all IN A SECOND TERMINAL NOW — it takes 30-40s.

0. Sidebar. Point at server/. "Seven files. That's the entire server —
   routing, caching, auth, storage." Cmd+B to hide the sidebar.

1. OPEN server/api/stars/[...repo].ts   (35s)
   "The filename is the route. [...repo] is a catch-all, so /api/stars/
   nitrojs/nitro arrives as one string."
   Point at defineCachedFunction: "This wrapper is the whole caching story.
   Look at what is NOT here: no redis client, no connection string, no
   invalidation logic."
   -> BROWSER localhost:3100, click Fetch stars. Orange ~250-360 ms NETWORK.
      Click again: green, under 1 ms, CACHE. Then hit x10 — a wall of green.
   SAY the numbers actually on your screen: "Three hundred milliseconds to zero
   point four. Same handler. The only thing I added was that wrapper."
   (Cold latency is network-dependent — I've measured 123 to 359 ms. Read it live.)

2. OPEN nitro.config.ts   (30s)
   Point at routeRules: "This is not application code. It's config. CORS,
   caching, a proxy, and basic auth, declared against URL patterns. Nitro
   compiles these into CDN headers on Vercel, _headers on Netlify, runtime
   middleware on Node."
   -> TERMINAL: ./demo.sh auth        401, then the page.
   -> OPEN server/routes/admin/index.ts
   SAY: "Zero lines of auth code in the handler. It's four words in a config
   file."

3. THE CLOSER — the terminal you started earlier   (25s)
   Five presets, five sizes. "Same source files. One environment variable
   changed. Cloudflare is smaller than Node because unenv stripped the Node
   compatibility layer."

IF IT BREAKS: don't debug on stage. Slide 5 has the same two snippets; read the
numbers off slide 4. No network kills beat 1 only. See RUNBOOK.md.

---

## Slide 7 — What it costs you

`[3:47 — 30s]`

Now the honest half.

v3 is beta, and two things bit me in one evening. The config wouldn't load until
I installed jiti — an optional peer dependency. And routes silently 404'd until
I set serverDir, which defaults to false.

The bigger one: deploy-anywhere covers your code, not your dependencies. My
filesystem storage driver pulled in a native binary and broke the Cloudflare and
Deno builds outright.

— — — if asked: the jiti error was just "createJiti is not a function", nothing
about jiti being missing. The storage fix was devStorage — filesystem in dev,
memory in production. Portability is a constraint you design for, not free.

---

## Slide 8 — Where Nitro actually sits

`[4:17 — 22s]`

Where it sits.

Express and Fastify route requests and stop there. Hono is the fair comparison:
also web standard, also multi-runtime, genuinely leaner — but it's a router, not
a build system. Next gives you batteries, Vercel-shaped.

Nitro's niche: I want the batteries and the deploy targets, without a frontend
framework or a vendor attached.

— — — if asked: it's not either-or — Nitro will run Hono as its server entry.
Dep counts are transitive packages from a clean npm install yesterday; Hono at
1 is genuinely impressive, it just does less.

---

## Slide 9 — Deployment as a compile target

`[4:39 — 18s]`

Would I use it?

For a new API that might move platforms, yes — for the caching and storage, not
the routing. Shipping next week? Wait for stable.

The idea worth stealing: deployment as a compile target. Which platform becomes
a build flag, not an architecture decision.

Thanks.

— — — if asked: v2 (nitropack) is production-proven today and runs Nuxt 3 and 4.

---
