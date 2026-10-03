# poc-bundler-comparison

## What
The same small React + TypeScript app (filter box, `lodash-es` `groupBy`/`debounce`) built by **Vite**, **Webpack** and **Parcel**, all configured in one folder. `scripts/benchmark.mjs` measures production build time, JS bundle size (raw and gzip) and dev-server cold start.

## Why
Bundler choice affects DX (cold start, HMR) and users (bundle size). Measuring beats repeating blog posts: you see how config cost, tree-shaking and the dev-server model (native ESM vs. bundle-first) behave on your machine.

## How to run
```bash
npm install
npm run build:vite     # -> dist-vite
npm run build:webpack  # -> dist-webpack
npm run build:parcel   # -> dist-parcel
npm run dev:vite       # :5171
npm run dev:webpack    # :5172
npm run dev:parcel     # :5173
npm run bench          # builds + starts each dev server, prints a markdown table
```

Layout: `vite.config.ts`, `webpack.config.cjs` + `templates/webpack.html`, `.parcelrc` (Parcel is zero-config; it reads `index.html`).

## Results (fill in from `npm run bench`)
Machine: ______  Node: ______  Date: ______

| Bundler | Build (s) | JS raw (KB) | JS gzip (KB) | Dev cold start (s) | Config lines | Notes |
|---|---|---|---|---|---|---|
| Vite | | | | | ~10 | |
| Webpack | | | | | ~30 | |
| Parcel | | | | | 3 | |

## What to tell a mentor
- Vite does not bundle in dev: it serves native ESM and transforms files on demand (esbuild), so cold start stays nearly flat as the app grows; Webpack bundles first, so it scales with app size.
- Production: Vite uses Rollup, Webpack its own graph, Parcel Rust-based tooling (SWC, lightningcss). Compare gzip sizes, not just raw.
- Webpack is the most explicit and flexible (loaders, plugins, module federation) but costs the most config; Parcel is zero-config; Vite is the sweet spot for most SPAs.
- Caveat: this is a tiny app. Differences grow with size, and Parcel's second build is fast due to its cache (the script clears it to measure cold builds). Webpack uses `ts-loader` with `transpileOnly` so no one pays for type-checking.
