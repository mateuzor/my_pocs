# poc-dynamic-import

The same primitive — the bundler-aware **`import()`** expression — powers three
levels of code splitting. All three create a separate chunk; they differ in
*what* you split and *how React renders it*.

| Strategy | API | Split unit | Best for |
|----------|-----|-----------|----------|
| 1. Manual `import()` | `await import('./mod')` | any module (logic) | heavy non-UI code: parsers, date/markdown libs |
| 2. `React.lazy` + Suspense | `lazy(() => import('./Comp'))` | a React component | conditionally-rendered UI: modals, tabs, charts |
| 3. Route-based | `lazy()` per route | a whole page | biggest first-load win — ship only the landing route |

### Key points (pitch de mentoria)
- It's **one mechanism** (`import()` returning a Promise → a new chunk). `React.lazy`
  is just a thin wrapper that lets a dynamic import render like a component.
- **Suspense** is what turns "the chunk is still downloading" into a declarative
  `fallback`, instead of manual loading flags.
- **Route-based splitting gives the most value**: the user downloads the page
  they asked for, not the entire app. Frameworks (Next, React Router) do this by default.
- Trade-off: each split = an extra request. Don't over-split tiny modules;
  preload critical chunks (`<link rel="modulepreload">`) when needed.

### Run
```bash
npm install
npm run dev   # open DevTools → Network and watch chunks load on interaction
```
