import { lazy, Suspense, useState } from 'react';

// STRATEGY 2 — React.lazy wraps a dynamic import() so the result can be
// rendered as a normal component. React suspends while the chunk loads, and
// <Suspense> shows the fallback. Use this for heavy *components* you render
// conditionally (modals, tabs, charts, editors).
const Chart = lazy(() => import('./heavy/Chart'));

export function LazyComponent() {
  const [show, setShow] = useState(false);

  return (
    <section>
      <h2>2. React.lazy + Suspense</h2>
      <button onClick={() => setShow((s) => !s)}>{show ? 'hide' : 'show'} chart</button>
      {/* The Chart chunk is fetched the first time `show` becomes true. */}
      {show && (
        <Suspense fallback={<p>loading chart…</p>}>
          <Chart />
        </Suspense>
      )}
    </section>
  );
}
