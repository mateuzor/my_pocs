# Bun POC

Demonstrates the four parts of Bun that replace separate Node tools:

| Bun feature | What it replaces |
|---|---|
| `Bun.serve()` | `http` module + Express/Fastify |
| `bun test` | Jest / Vitest / Mocha + ts-jest |
| `bun build` | webpack / esbuild / Vite (for backend bundles) |
| Native `.ts` execution | `tsx` / `ts-node` / build step |

## Run

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# In this folder:
bun install         # install deps (instant — Bun's installer is ~20x faster than npm)
bun run dev         # HTTP server with hot reload
bun test            # run the test suite
bun run bench       # microbenchmarks using Bun.nanoseconds()
bun run build       # produce a single-file bundle to dist/
```

## Why it matters

- **One binary, four tools.** No package.json scripts gymnastics, no installing
  Jest + ts-jest + babel + esbuild + nodemon to do basic things.
- **Native TS.** `.ts` files run directly. No build step in dev.
- **Web-standard APIs.** `Bun.serve` uses `Request` / `Response` — the same
  primitives used in Workers, Deno, and modern fetch. Easy portability.
- **Speed.** Bun's HTTP server, package installer, test runner, and bundler
  are all significantly faster than their Node counterparts in benchmarks
  (~3-4x for HTTP, ~20x for installs, ~5x for tests).
