# Deploy: `node-server` preset (default)

Nitro's headline feature is the **deploy preset**: the *same* code builds to
many targets. `node-server` is the default — a self-contained Node server.

```bash
npm run build                    # -> .output/
node .output/server/index.mjs    # runs anywhere Node runs
```

- Output is fully self-contained in `.output/` (server bundle + public assets).
- No framework runtime needed to run — just Node.
- Force it explicitly with `NITRO_PRESET=node_server npm run build`.

The point: you write handlers once, and the *build target* — not your code —
decides how it's packaged.
