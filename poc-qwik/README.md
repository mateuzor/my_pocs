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

## Run
```bash
npm install
npm run dev
```
