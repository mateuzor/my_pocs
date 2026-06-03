# poc-single-spa-vs-mf

Two ways to build **microfrontends**, modeled with tiny from-scratch versions
so the difference in *philosophy* is obvious (`single-spa-lite.ts` vs `mf-lite.ts`).

### The core difference

|  | **Single-SPA** | **Module Federation** |
|--|----------------|------------------------|
| Unit of composition | a whole **app** | a single **module** (component/fn) |
| Who decides what shows | a **root router** via `activeWhen(location)` | the **host**, anywhere, anytime (lazy) |
| Coupling to routing | tightly tied to the URL | none — load on click, on view, on demand |
| Lifecycle | `bootstrap → mount → unmount` per app | `import()` an exposed module |
| Shared deps | each app bundles its own (or import maps) | **share scope** dedupes one copy |
| Build tooling | framework-agnostic, build-agnostic | needs the bundler plugin (Webpack/Vite/rspack) |

### How to think about it (pitch de mentoria)
- **Single-SPA** answers *"which app owns this route?"* — great when teams own
  whole pages/sections and you want a clean per-route mount/unmount boundary.
- **Module Federation** answers *"how do I drop team B's live component into my
  page without redeploying?"* — great for sharing widgets and deduping React.
- They're **not exclusive**: a common setup is single-spa for top-level routing
  **and** Module Federation to share components between those apps.

### Run
```bash
npm install
npm run dev   # toggle #/cart and #/profile; watch the federated widget load
```
> See also the standalone [poc-module-federation](../poc-module-federation).
