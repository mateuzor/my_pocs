import { lazy, Suspense, useState } from 'react';

// React.lazy + dynamic import() makes webpack emit a separate chunk per page.
// moment (heavy) is only downloaded if the user opens that tab, so it stays out of the initial bundle.
// Webpack magic comments name the chunks so they are easy to find in the treemap.
const MomentPage = lazy(() => import(/* webpackChunkName: "page-moment" */ './pages/MomentPage'));
const DateFnsPage = lazy(() => import(/* webpackChunkName: "page-date-fns" */ './pages/DateFnsPage'));

export function App() {
  const [tab, setTab] = useState<'moment' | 'date-fns'>('date-fns');

  return (
    <main style={{ fontFamily: 'system-ui', maxWidth: 560, margin: '2rem auto' }}>
      <h1>Bundle Analyzer POC</h1>
      <nav style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => setTab('moment')}>moment</button>
        <button onClick={() => setTab('date-fns')}>date-fns</button>
      </nav>
      <Suspense fallback={<p>Loading chunk...</p>}>
        {tab === 'moment' ? <MomentPage /> : <DateFnsPage />}
      </Suspense>
    </main>
  );
}
