# poc-turborepo

A minimal monorepo wired with **Turborepo** to show three ideas:

```
poc-turborepo/
├── turbo.json            # task pipeline + caching rules
├── package.json          # workspaces: apps/*, packages/*
├── packages/ui           # @poc/ui  — shared library
└── apps/web              # @poc/web — depends on @poc/ui
```

### The three concepts (pitch de mentoria)

1. **Workspace graph** — `@poc/web` lists `"@poc/ui": "*"` as a dependency. The
   package manager symlinks the local package; Turborepo reads that edge.
2. **Topological scheduling** — `"dependsOn": ["^build"]` means *build my
   dependencies first*. Turborepo runs the rest **in parallel**, in graph order.
3. **Content-hash caching** — `outputs: ["dist/**"]` lets Turborepo hash inputs
   and **restore outputs from cache** when nothing changed. The second
   `turbo run build` is near-instant (`FULL TURBO`).

### Run
```bash
npm install
npm run build      # builds @poc/ui then @poc/web
npm run build      # second run hits the cache
```
