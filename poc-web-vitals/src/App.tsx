import { useEffect, useState } from 'react';
import { subscribe } from './lib/report';
import type { MetricWithAttribution } from 'web-vitals/attribution';
import { BadLcp } from './pages/BadLcp';
import { BadCls } from './pages/BadCls';
import { BadInp } from './pages/BadInp';
import { Slow } from './pages/Slow';

const pages = { LCP: BadLcp, CLS: BadCls, INP: BadInp, 'FCP/TTFB': Slow };
type PageKey = keyof typeof pages;

export function App() {
  const [page, setPage] = useState<PageKey>('LCP');
  const [metrics, setMetrics] = useState<Record<string, MetricWithAttribution>>({});

  useEffect(() => subscribe((m) => setMetrics((prev) => ({ ...prev, [m.name]: m }))), []);

  const Page = pages[page];
  return (
    <main style={{ fontFamily: 'sans-serif', padding: 16 }}>
      <h1>Web Vitals</h1>
      <nav>
        {(Object.keys(pages) as PageKey[]).map((k) => (
          <button key={k} onClick={() => setPage(k)} disabled={k === page}>
            {k}
          </button>
        ))}
      </nav>
      <Page />
      <h3>Captured</h3>
      <ul>
        {Object.values(metrics).map((m) => (
          <li key={m.name}>
            {m.name}: {Math.round(m.value)} ({m.rating})
          </li>
        ))}
      </ul>
    </main>
  );
}
