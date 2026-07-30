# Code tour — what to open, in what order, and what to say

This is the editor half of the demo. **~110 seconds total.** Four files, four
beats. Each file fits one screen at font 18 — you never scroll.

> Open the project first: `cd poc-nitro-v3-talk && code .`
> The workspace already sets font 18, hides `node_modules`, and kills the minimap.
> Press **Cmd+B** to hide the sidebar once you've shown the tree.

---

## Beat 0 — the tree (10s)

Sidebar open. Point at `server/`.

> **"Seven files. That's the entire server — routing, caching, auth, storage."**

Don't linger. Cmd+B to collapse the sidebar and go to beat 1.

---

## Beat 1 — `server/api/stars/[...repo].ts` (35s) ← the money shot

Open the file. Let them read it for a beat, then:

> **"The filename is the route. Square-bracket-dot-dot-dot repo is a catch-all,
> so slash api slash stars slash nitrojs slash nitro arrives as one string."**

Point at `defineCachedFunction`:

> **"This wrapper is the whole caching story. Look at what is NOT here: no redis
> client, no connection string, no invalidation logic. It's backed by the storage
> layer — files on disk in dev, Redis or Workers KV in prod, changed in config."**

**Now switch to the browser** (`localhost:3100`) and click **Fetch stars**:

- First row: orange, `~250–360 ms`, **NETWORK**
- Click again: green, `<1 ms`, **CACHE**
- Click **×10**: a wall of green

> **"Three hundred milliseconds to zero point four. Same handler. The only
> thing I added was that wrapper."**

---

## Beat 2 — `nitro.config.ts` (30s)

Back to the editor. Open it. This is the file that surprises people.

Point at `routeRules`:

> **"This is not application code. It's config. CORS, caching, a proxy, and HTTP
> basic auth — declared against URL patterns. Nitro compiles these into whatever
> the target understands: real CDN headers on Vercel, a `_headers` file on
> Netlify, runtime middleware on Node."**

Then the consequence, in the terminal:

```bash
./demo.sh auth
```

`401`, then the page loads.

> **"That admin route has a password. Now watch —"**

Open `server/routes/admin/index.ts` (15 lines, one screen):

> **"— zero lines of auth code in the handler. It's four words in a config file."**

If you have a spare 5 seconds, also run `./demo.sh time`: the clock freezes,
and `server/api/time.ts` contains nothing but `new Date()`.

---

## Beat 3 — the closer: five presets (25s)

Terminal:

```bash
./demo.sh build-all
```

> **"Same source files. The only thing that changed is one environment variable.
> Node, Cloudflare, Vercel, Deno, Bun — five real builds."**

Point at the sizes:

> **"Notice Cloudflare is smaller than Node — unenv stripped the Node
> compatibility layer it doesn't need there. Each target gets its own build."**

⚠️ **`build-all` takes 30–40 seconds of wall clock.** Two options:
- **Recommended:** start it in a second terminal during beat 1, so the output is
  already sitting there when you arrive.
- Or run it live and narrate beat 2's punchline while it churns.

---

## Files you are NOT opening (but can, if asked)

| File | If someone asks about… |
|---|---|
| `server/api/hello.get.ts` / `.post.ts` | method routing by filename, `HTTPError` |
| `server/api/visits.ts` | `useStorage()` — KV with no provisioning |
| `server/api/time.ts` | route-rule caching from the handler's point of view |
| `server/middleware/1.timing.ts` | auto-registered middleware, numeric ordering |
| `public/index.html` | the dashboard itself (plain HTML, no framework) |

---

## Order-of-operations cheat card

```
  Cmd+B            show tree  ->  "seven files"
  open  stars/[...repo].ts    ->  "no redis client"
  browser, Fetch stars, x10   ->  "~300 ms to 0.4"
  open  nitro.config.ts       ->  "this is config, not code"
  ./demo.sh auth              ->  401 then 200
  open  routes/admin/index.ts ->  "zero auth code"
  ./demo.sh build-all         ->  five presets    [start this early!]
```

## If the editor fights you

- Font too small at the back? **Cmd+=** a couple of times.
- Accidentally in Zen mode? **Cmd+K Z** toggles it.
- Sidebar in the way? **Cmd+B**.
- Wrong window on the projector? Don't fix it live — talk over it and use slide 5,
  which has the same two code snippets on it.
