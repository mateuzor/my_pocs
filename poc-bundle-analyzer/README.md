# poc-bundle-analyzer

## What
Webpack Bundle Analyzer renders your build output as an interactive treemap: each rectangle is a module, sized by its bytes. This POC is a small webpack + React + TypeScript app that shows a heavy dependency (`moment`, plus a full `lodash` import) next to a tree-shakeable one (`date-fns`), loaded through lazy-split chunks.

## Why
Bundle size is a performance budget, and it is easy to blow it with one innocent import. The treemap shows what you are really shipping, so you can decide with data whether to swap a library, import less of it, or move it behind a dynamic `import()`.

## How to run
```
npm install
npm run analyze        # builds and writes dist/report.html (open it in a browser)
npm run analyze:slim   # same, but ignores moment locales -> dist/report-slim.html
npm run stats          # alternative: stats.json + interactive server
npm start              # dev server
```

## How to read the treemap
- Area equals size. Large blocks are the first suspects. Nested boxes are folders inside `node_modules`.
- Use the sidebar to switch between Stat (source), Parsed (after minification) and Gzip (what users download).
- Look at the top-level groups: `react-vendor`, `page-moment`, `page-date-fns` and the main chunk. Each group is one file in `dist`.
- In `page-moment`, find `moment/locale` (about 130 files) and the whole `lodash` package. Compare with `report-slim.html`, where the locales are gone.
- `page-date-fns` should only contain a few small modules thanks to tree-shaking.

## What to tell a mentor
- I measure first, then optimize: analyzer, then a targeted fix (IgnorePlugin, per-method lodash imports, a lighter library).
- `React.lazy` with `import()` splits routes into chunks, so heavy code is paid for only when used. A vendor `cacheGroup` isolates React for better caching.
- `contenthash` filenames and `performance.hints` support caching and size budgets.
