# nitro-poc

Proof-of-concept built for a 5-minute talk on **Nitro v3** (`3.0.260610-beta`).

Every number quoted in the deck was measured here. Nothing is copied from
marketing material.

- **Slides:** [`deck/Nitro-v3-5min.pptx`](deck/Nitro-v3-5min.pptx) — 10 slides, speaker notes on every slide
- **Talk-day instructions:** [`RUNBOOK.md`](RUNBOOK.md)
- **Demo driver:** [`demo.sh`](demo.sh)

## Run it

```bash
nvm use 20                 # Nitro v3 requires Node 20+
npm install
PORT=3100 npm run dev      # 3000 is usually taken
open http://localhost:3100
```

## What it demonstrates

| File | Feature |
|---|---|
| [`server/api/hello.get.ts`](server/api/hello.get.ts) · [`.post.ts`](server/api/hello.post.ts) | filesystem routing, method suffix, `HTTPError` |
| [`server/api/stars/[...repo].ts`](server/api/stars/%5B...repo%5D.ts) | catch-all param + `defineCachedFunction` (**≈300 ms → 0.4 ms**) |
| [`server/api/time.ts`](server/api/time.ts) | route-rule caching — handler contains no cache code |
| [`server/api/visits.ts`](server/api/visits.ts) | `useStorage()` KV counter, driver swappable via config |
| [`server/routes/admin/index.ts`](server/routes/admin/index.ts) | protected by `basicAuth` — file contains no auth code |
| [`server/middleware/1.timing.ts`](server/middleware/1.timing.ts) | auto-registered middleware, ordered by filename |
| [`nitro.config.ts`](nitro.config.ts) | route rules: cors, swr, proxy, basicAuth, headers |
| [`public/index.html`](public/index.html) | dashboard that visualises cache hits live |

```bash
./demo.sh tree        # the whole server, 7 files
./demo.sh cache       # ~300 ms -> 0.4 ms
./demo.sh time        # the clock freezes (swr: 10)
./demo.sh auth        # 401 -> 200, no auth code
./demo.sh build-all   # 5 presets, 5 outputs
```

## Measured results

Node 20.19.0, macOS, 2026-07-29.

| preset | output | gzip |
|---|---|---|
| node | 114 kB | 33.3 kB |
| cloudflare_module | 88.2 kB | 26.6 kB |
| vercel | 87.5 kB | 26.3 kB |
| deno_deploy | 95.7 kB | 29.0 kB |
| bun | 96.2 kB | 29.3 kB |

Per-route chunk: 359 B for `/api/hello`. Dev rebuild: 22 ms.
Transitive deps: `nitro` v3 = **25**, `nitropack` v2 = **273**.

## Three things that cost me time (all real, all in the deck)

1. **`jiti` is an optional peer dependency.** Without it, `nitro.config.ts` never
   loads and you get `TypeError: createJiti is not a function` — no mention of jiti.
2. **`serverDir` defaults to `false`.** Routes in `routes/` are silently ignored
   and every request 404s. You must set it (or use programmatic `routes`).
3. **"Deploy anywhere" applies to your code, not your dependencies.** An `fs`
   storage driver pulls in `chokidar` → native `fsevents`, which fails the
   `cloudflare_module` and `deno_deploy` builds outright. Fixed with `devStorage`:
   filesystem in dev, memory in production.

Also worth knowing: a `routeRules` `swr` on `/api/stars/**` caches the *entire
response*, including the latency I was trying to measure — so the demo showed a
frozen `342.5 ms` and the cache looked broken. Function-level and route-level
caching are different tools; don't stack them by accident.

## Regenerating the deck

```bash
pip3 install python-pptx
python3 deck/build_deck.py
```

Rendered previews of all 10 slides are in `deck/render/`.
