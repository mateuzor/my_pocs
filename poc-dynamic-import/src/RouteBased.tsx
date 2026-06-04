import { lazy, Suspense, useState } from 'react';

// STRATEGY 3 — route-based splitting: the MOST IMPACTFUL split. Each route's
// component is lazy, so the initial download only contains the landing route.
// Every other page ships as its own chunk, fetched on navigation. This is the
// default pattern in Next.js / React Router and gives the biggest first-load win.
const routes = {
  dashboard: lazy(() => import('./pages/Dashboard')),
  settings: lazy(() => import('./pages/Settings')),
} as const;

type RouteKey = keyof typeof routes;

export function RouteBased() {
  const [route, setRoute] = useState<RouteKey>('dashboard');
  const Page = routes[route];

  return (
    <section>
      <h2>3. Route-based splitting</h2>
      {(Object.keys(routes) as RouteKey[]).map((r) => (
        <button key={r} onClick={() => setRoute(r)} disabled={r === route}>
          {r}
        </button>
      ))}
      <Suspense fallback={<p>loading page…</p>}>
        <Page />
      </Suspense>
    </section>
  );
}
