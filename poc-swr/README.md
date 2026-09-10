# poc-swr

## What
SWR ("stale-while-revalidate") is a React data-fetching hook library by Vercel. `useSWR(key, fetcher)` returns cached (stale) data immediately, then revalidates in the background and updates the UI. This POC uses a tiny fake API with latency and covers: `useSWR`, `mutate` (bound and global), optimistic updates with rollback, revalidation (on focus, polling), request deduplication and `useSWRInfinite`.

## Why
Fetching in `useEffect` leads to duplicated requests, race conditions and no caching. SWR makes the key the identity of the data: components sharing a key share cache and requests, the UI feels instant, and data stays fresh automatically.

## How to run
```
npm install
npm run dev
```
Try: add a todo (appears instantly), add one containing "fail" (rolls back), switch tabs (revalidates), click "Load more".

## SWR vs React Query
- SWR: smaller (~4kb), minimal API, great for read-heavy UIs. Mutations are done with `mutate` / `useSWRMutation`.
- React Query: bigger API, first-class `useMutation`, devtools, query invalidation by key prefixes, richer retry/offline/pagination tools, `gcTime`/`staleTime` tuning.
- Both implement stale-while-revalidate, dedupe and focus refetch; choose SWR for simplicity, React Query for complex mutation flows.

## What to tell a mentor
- The key is the cache identity; same key = shared state and one request.
- Optimistic UI = `optimisticData` + `rollbackOnError` in `mutate`.
- `dedupingInterval` collapses simultaneous requests; `SWRConfig` sets global defaults.
- `useSWRInfinite` models pages through `getKey`, returning `null` to stop.
