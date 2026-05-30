# poc-recoil

Recoil's mental model: state is a **graph**, not a single store.

| Primitive | What it is | Hook |
|-----------|-----------|------|
| **atom** | a writable unit of state, uniquely keyed | `useRecoilState` / `useSetRecoilState` |
| **selector** | pure, memoized derived state (sync) | `useRecoilValue` |
| **async selector** | derived state whose `get` returns a Promise → integrates with Suspense | `useRecoilValue` + `<Suspense>` |
| **selectorFamily** | a selector parameterized by an argument | `userQuery(id)` |

### Why it matters (pitch de mentoria)
- **Fine-grained re-renders:** a component only re-renders for the exact atoms/selectors it reads — no global store diffing.
- **Derived state is free:** selectors memoize and recompute only when a dependency they actually read changes.
- **Async is just data:** an async selector caches by key, so re-reading a fetched id is instant and Suspense handles loading with no manual flags.

### Run
```bash
npm install
npm run dev
```
