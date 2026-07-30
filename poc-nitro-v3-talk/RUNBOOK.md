# Runbook — Nitro v3, 5-minute talk

Read this once tonight. Skim §3 right before you go on.
The file-by-file code tour is in **[TOUR.md](TOUR.md)** — that's the demo script.

---

## 1. Setup on the company machine

You said you'll run the demo there, so do this **the moment you arrive**, not
five minutes before you present.

```bash
git clone https://github.com/mateuzor/my_pocs.git
cd my_pocs/poc-nitro-v3-talk

node -v            # MUST be >= 20. Nitro v3 does not run on 18.
npm install        # ~30s, needs access to registry.npmjs.org
PORT=3100 npm run dev
```

Then open **http://localhost:3100** — you should see the dark dashboard.

```bash
./demo.sh all      # smoke-test every beat at once
```

Green `cache` rows + a `401` = you're ready.

### Corporate-machine failure modes, in order of likelihood

| Problem | Check | Plan B |
|---|---|---|
| Node < 20 | `node -v` | `nvm install 20`, or **present from your own laptop** |
| npm registry blocked by proxy | `npm ping` | Bring `node_modules/` on a USB stick, or present from your laptop |
| Port 3100 taken | `lsof -i :3100` | `PORT=4000 npm run dev` (then use 4000 everywhere) |
| No internet at all | `curl api.github.com` | Beat 1 breaks — see §4. Beats 2–4 work offline |
| VS Code not installed | — | Any editor works; the tour is just 4 files |

> **Decide the fallback before you start.** If Node is 18 and you can't install
> 20, presenting the demo from your own laptop is a 10-second decision beforehand
> and a disaster mid-talk.

### Two gotchas that break it silently

| Symptom | Cause | Fix |
|---|---|---|
| `TypeError: createJiti is not a function` | `jiti` missing (optional peer dep) | already in `package.json` — just `npm install` |
| Every route returns 404 | `serverDir` unset (defaults to `false`) | already set in `nitro.config.ts` |

---

## 2. Windows to open, in this order

1. **PowerPoint** — `deck/Nitro-v3-5min.pptx`, **Presenter View** (that's where the notes are)
2. **VS Code** — `code .` in the project. Workspace already sets font 18, hides `node_modules`, kills the minimap
3. **Browser** — `http://localhost:3100`
4. **Terminal A** — dev server running
5. **Terminal B** — where you type. Make the font big
6. **Terminal C** — for `build-all`, started early (see below)

---

## 3. The demo — slide 6, 110 seconds

**Full script with the exact words: [TOUR.md](TOUR.md).** Short version:

```
  START ./demo.sh build-all IN TERMINAL C NOW   (takes 30-40s)

  Cmd+B, point at server/       ->  "seven files, that's the whole server"
  open stars/[...repo].ts       ->  "no redis client, no connection string"
  browser: Fetch stars, then x10 ->  ~300 ms becomes 0.4 ms
  open nitro.config.ts          ->  "this is config, not application code"
  ./demo.sh auth                ->  401, then 200
  open routes/admin/index.ts    ->  "zero auth code in this file"
  back to Terminal C            ->  five presets, five sizes
```

**Start `build-all` first.** It's the closer and it takes 30–40 seconds — if you
launch it when you get to it, you'll be standing in silence.

If you're running long, **cut the `/api/time` beat**. Never cut beat 1 (the cache)
or beat 4 (the presets).

---

## 4. If something breaks

- **Don't debug on stage.** Slide 5 has the same two code snippets; slide 4 has
  every build number. You can deliver the whole talk off the slides.
- Pre-rendered slides: `deck/render/s01.png` … `s09.png`.
- **No network?** Beat 1 will *not* work, and know why: failures aren't cached
  (the `.catch()` sits outside the cached function), so every call re-hits the
  network and stays tagged `network`. Verified — a failing upstream returns
  `stars: null` at 20–250 ms forever, never `cache`.
  → Fall back to `./demo.sh time` and `./demo.sh build-all`. Both are fully
  offline. Read ≈300 ms → 0.4 ms off slide 4.
- **Test the venue wifi first** with `./demo.sh cache`. Green rows = beat 1 is safe.

---

## 5. Numbers you might be asked for

Measured 2026-07-29, Node 20.19.0, `nitro@3.0.260610-beta`.

| Thing | Value |
|---|---|
| Cold call → cached call | ≈300 ms → 0.4 ms |
| node build | 114 kB (33.3 kB gzip) |
| cloudflare_module | 88.2 kB (26.6 kB gzip) |
| vercel | 87.5 kB (26.3 kB gzip) |
| deno_deploy | 95.7 kB (29.0 kB gzip) |
| bun | 96.2 kB (29.3 kB gzip) |
| Per-route chunk | 359 B for `/api/hello` |
| Dev rebuild | 22 ms |
| `nitro` v3 transitive deps | 25 |
| `nitropack` v2 transitive deps | 273 |
| `hono` / `fastify` / `express` | 1 / 41 / 65 |

Reproduce the dep counts:

```bash
mkdir /tmp/c && cd /tmp/c && npm init -y && npm i nitro@latest
ls node_modules | grep -v '^\.' | wc -l
```

---

## 6. Questions to expect

**"Is it production ready?"**
v2 (`nitropack`) is — it runs Nuxt 3 and 4 in production. v3 is beta; I'd wait
for stable for anything shipping next week.

**"Why not just Hono?"**
Hono is leaner and excellent, but it's a router. No deployment presets, no
storage layer, no route rules. And they compose — Nitro will run Hono as its
server entry, so it isn't either-or.

**"How is this different from Next.js API routes?"**
Similar batteries, but Next is shaped around Vercel and ships a frontend
framework you may not want. Nitro is backend-only and vendor-neutral.

**"Does the cache work on serverless / edge?"**
Yes, but you must pass `event` as the first argument to the cached function so
Nitro can use `event.waitUntil` to keep the instance alive during background
revalidation. My POC doesn't, because it runs on Node — that's a real caveat.

**"What about cold starts?"**
Didn't measure it. Say so — don't guess. The 88 kB Cloudflare bundle is a good
sign but I have no number.

**"Can I see more of the code?"**
Files you didn't open are listed at the bottom of [TOUR.md](TOUR.md).

---

## 7. Timing map (total 4:57)

| Slide | Topic | In | Length |
|---|---|---|---|
| 1 | Title | 0:00 | 15s |
| 2 | What it is | 0:15 | 25s |
| 3 | How it works | 0:40 | 30s |
| 4 | Presets + real numbers | 1:10 | 25s |
| 5 | Code preview | 1:35 | 22s |
| **6** | **DEMO — editor + browser + terminal** | **1:57** | **110s** |
| 7 | Trade-offs | 3:47 | 30s |
| 8 | vs alternatives | 4:17 | 22s |
| 9 | Verdict | 4:39 | 18s |

Notes run at ~138 words/minute — a normal talking pace. Each note ends with a
`— — — if asked:` block: **don't read that part**, it's Q&A ammunition.

Over time at slide 7? Skip slide 8 and go straight to 9. The verdict matters
more than the comparison table.
