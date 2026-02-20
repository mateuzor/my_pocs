import { useState } from 'react';
import axios from 'axios';

interface Result { label: string; code: string; output: string; duration: number; }

export default function FetchVsAxiosDemo() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  const run = async (label: string, code: string, fn: () => Promise<string>): Promise<void> => {
    const start = performance.now();
    const output = await fn().catch(e => `ERROR: ${e.message}`);
    const duration = Math.round(performance.now() - start);
    setResults(prev => [{ label, code, output, duration }, ...prev].slice(0, 8));
  };

  const runAll = async () => {
    setLoading(true);
    setResults([]);

    // 1. Basic GET
    await run(
      'Fetch — basic GET',
      `const res = await fetch(url);\nconst data = await res.json();`,
      async () => {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        const data = await res.json();
        return `title: "${data.title.slice(0, 40)}..."`;
      }
    );

    await run(
      'Axios — basic GET',
      `const res = await axios.get(url);\nconst data = res.data; // no .json()!`,
      async () => {
        const res = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
        return `title: "${res.data.title.slice(0, 40)}..."`;
      }
    );

    // 2. Error handling
    await run(
      'Fetch — 404 (no throw!)',
      `const res = await fetch(url);\nif (!res.ok) throw new Error(res.status);`,
      async () => {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts/99999');
        return `res.ok: ${res.ok}, status: ${res.status} — must check manually!`;
      }
    );

    await run(
      'Axios — 404 (auto throws)',
      `try { await axios.get(url) }\ncatch(e) { /* e.response.status */ }`,
      async () => {
        try {
          await axios.get('https://jsonplaceholder.typicode.com/posts/99999');
          return 'no error?';
        } catch (e: any) {
          return `Auto threw: HTTP ${e.response?.status} — no manual check needed`;
        }
      }
    );

    // 3. POST with JSON
    await run(
      'Fetch — POST JSON',
      `fetch(url, {\n  method: 'POST',\n  headers: {'Content-Type':'application/json'},\n  body: JSON.stringify(data)\n})`,
      async () => {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'test', body: 'body', userId: 1 }),
        });
        const data = await res.json();
        return `created id: ${data.id}`;
      }
    );

    await run(
      'Axios — POST JSON',
      `axios.post(url, data)\n// headers set automatically!`,
      async () => {
        const res = await axios.post('https://jsonplaceholder.typicode.com/posts', {
          title: 'test', body: 'body', userId: 1,
        });
        return `created id: ${res.data.id} — headers auto-set!`;
      }
    );

    setLoading(false);
  };

  const labelColor = (label: string) => label.startsWith('Fetch') ? '#1976d2' : '#e65100';

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Fetch vs Axios — Side by Side</h1>

      <button onClick={runAll} disabled={loading}
        style={{ padding: '12px 24px', cursor: 'pointer', backgroundColor: '#6a1b9a', color: 'white', border: 'none', borderRadius: '4px', marginBottom: '30px', fontSize: '16px' }}>
        {loading ? 'Running comparisons...' : 'Run all comparisons'}
      </button>

      {/* Comparison table */}
      <div style={{ marginBottom: '30px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Feature</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd', color: '#1976d2' }}>fetch()</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd', color: '#e65100' }}>axios</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Built-in', '✅ Native browser/Node', '❌ External dependency (~13kb)'],
              ['Response data', 'await res.json()', 'res.data (auto-parsed)'],
              ['Error on 4xx/5xx', '❌ Must check res.ok manually', '✅ Throws automatically'],
              ['Request timeout', '❌ Need AbortController', '✅ timeout option built-in'],
              ['Interceptors', '❌ Must wrap manually', '✅ Built-in interceptors'],
              ['Base URL', '❌ Manual string concat', '✅ baseURL in instance'],
              ['TypeScript', '⚠️ Partial types', '✅ Full generic support'],
              ['Progress tracking', '❌ Not supported', '✅ onUploadProgress / onDownloadProgress'],
              ['Node.js', '✅ v18+ native', '✅ Works everywhere'],
              ['Request cancel', 'AbortController (native)', 'CancelToken or AbortController'],
            ].map(([feat, fetchVal, axiosVal], i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? 'white' : '#fafafa' }}>
                <td style={{ padding: '10px 12px', border: '1px solid #ddd', fontWeight: 'bold' }}>{feat}</td>
                <td style={{ padding: '10px 12px', border: '1px solid #ddd', fontFamily: 'monospace', fontSize: '13px' }}>{fetchVal}</td>
                <td style={{ padding: '10px 12px', border: '1px solid #ddd', fontFamily: 'monospace', fontSize: '13px' }}>{axiosVal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Live results */}
      {results.length > 0 && (
        <div>
          <h2>Live Results</h2>
          {results.map((r, i) => (
            <div key={i} style={{ marginBottom: '12px', padding: '15px', borderRadius: '6px', borderLeft: `4px solid ${labelColor(r.label)}`, backgroundColor: '#fafafa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <strong style={{ color: labelColor(r.label) }}>{r.label}</strong>
                <span style={{ fontSize: '12px', color: '#888' }}>{r.duration}ms</span>
              </div>
              <pre style={{ margin: '0 0 8px', fontSize: '12px', color: '#555', backgroundColor: '#f0f0f0', padding: '8px', borderRadius: '4px' }}>{r.code}</pre>
              <div style={{ fontSize: '13px', color: '#333' }}>→ {r.output}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
