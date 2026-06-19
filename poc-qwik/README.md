# poc-qwik

A Qwik + Qwik City app exploring **resumability** — Qwik's headline idea and the
main thing to be able to explain.

## Resumability vs hydration (the core idea)

| | Hydration (React/Vue/Angular SSR) | **Resumability (Qwik)** |
|--|-----------------------------------|--------------------------|
| On load, the client… | re-runs the whole component tree to re-attach listeners | does **nothing** — it resumes from serialized state |
| Initial JS | grows with app size (must download framework + components) | ≈ constant, near-zero; code is fetched per interaction |
| Event handlers | all wired up eagerly during hydration | each `$` handler is a lazy chunk, fetched on the event |
| State | rebuilt in memory | serialized into the HTML, deserialized lazily |

**Why it matters:** hydration cost scales with app size and blocks
interactivity (TTI). Qwik ships the HTML already interactive — clicking a button
fetches just that handler's chunk (prefetched in the background), so a huge app
starts as fast as a tiny one.

## The `$` boundary
Every `$` (`component$`, `onClick$`, `routeLoader$`, `useTask$`…) is a marker the
**optimizer** turns into a separately-loadable chunk. That's what makes
fine-grained lazy loading automatic — you don't hand-split anything.

## Qwik City (routing / SSR)

| Piece | File | Idea |
|-------|------|------|
| File-based routing | `routes/**/index.tsx` | folder path = URL, zero config |
| Layout | `routes/layout.tsx` | wraps child routes via `<Slot/>` |
| `routeLoader$` | `routes/users/[id]/index.tsx` | server-side data, serialized into HTML |
| `routeAction$` + `<Form>` | `routes/contact/index.tsx` | server form handling, progressively enhanced |
| Speculative prefetch | `routes/service-worker.ts` + `<ServiceWorkerRegister/>` | caches likely-next chunks |

**Pitch:** loaders/actions run on the server and their data is part of the
resumable snapshot — no client refetch on load. `<Link>` + the prefetch SW make
navigation feel instant because the next route's `$` chunks are already cached.

## When to reach for Qwik (and when not to)

**Great when:** large content/commerce sites where first-load JS and TTI matter
most; many routes where users touch only a few; SEO + instant interactivity.

**Think twice when:** heavily interactive SPAs where almost all code runs anyway
(the lazy-loading win shrinks); teams unfamiliar with the `$`/serialization
mental model; libraries that assume hydration or hold non-serializable state.

| | Qwik | React/Angular SSR | Astro islands |
|--|------|-------------------|----------------|
| Client work on load | resume (≈0) | hydrate whole tree | hydrate per island |
| Granularity | per `$` (function-level) | per app | per island (component) |
| Data | loader value serialized | refetch / serialize + hydrate | island props |

**One-line pitch:** *Astro defers hydration per island; Qwik removes hydration
entirely by serializing the whole app and resuming function-by-function.*

## Run
```bash
npm install
npm run dev      # SSR dev server
npm run build    # client build
```
