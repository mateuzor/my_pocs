import { useState } from 'react';
import axios from 'axios';

interface Timing { label: string; duration: number; requests: number; }

export default function FetchPerformanceDemo() {
  const [timings, setTimings] = useState<Timing[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  const addTiming = (t: Timing) => setTimings(prev => [t, ...prev].slice(0, 10));

  const measure = async (label: string, requests: number, fn: () => Promise<void>) => {
    setLoading(label);
    const start = performance.now();
    await fn();
    const duration = Math.round(performance.now() - start);
    addTiming({ label, duration, requests });
    setLoading(null);
  };

  // Sequential fetch
  const sequential = () => measure('Sequential fetch (10 req)', 10, async () => {
    for (let i = 1; i <= 10; i++) {
      await fetch(`https://jsonplaceholder.typicode.com/posts/${i}`);
    }
  });

  // Parallel fetch
  const parallel = () => measure('Parallel fetch (10 req)', 10, async () => {
    await Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        fetch(`https://jsonplaceholder.typicode.com/posts/${i + 1}`)
      )
    );
  });

  // Parallel with limit (concurrency control)
  const parallelLimited = () => measure('Parallel fetch (limit 3)', 10, async () => {
    const urls = Array.from({ length: 10 }, (_, i) => `https://jsonplaceholder.typicode.com/posts/${i + 1}`);
    const concurrency = 3;

    for (let i = 0; i < urls.length; i += concurrency) {
      await Promise.all(urls.slice(i, i + concurrency).map(url => fetch(url)));
    }
  });

  // Parallel axios
  const parallelAxios = () => measure('Parallel axios (10 req)', 10, async () => {
    await Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        axios.get(`https://jsonplaceholder.typicode.com/posts/${i + 1}`)
      )
    );
  });

  // axios with connection reuse (same instance)
  const axiosInstance = () => measure('Axios instance (10 req)', 10, async () => {
    const api = axios.create({ baseURL: 'https://jsonplaceholder.typicode.com' });
    await Promise.all(
      Array.from({ length: 10 }, (_, i) => api.get(`/posts/${i + 1}`))
    );
  });

  const maxDuration = Math.max(...timings.map(t => t.duration), 1);

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Fetch vs Axios — Performance</h1>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
        <strong>Key insight:</strong> The biggest performance gain comes from <strong>parallel requests</strong>
        (Promise.all), not from choosing fetch vs axios. Both have similar raw performance.
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '30px' }}>
        {[
          { label: 'Sequential (10)', fn: sequential, color: '#c62828' },
          { label: 'Parallel (10)', fn: parallel, color: '#388e3c' },
          { label: 'Parallel limited (3)', fn: parallelLimited, color: '#f57c00' },
          { label: 'Axios parallel', fn: parallelAxios, color: '#1565c0' },
          { label: 'Axios instance', fn: axiosInstance, color: '#6a1b9a' },
        ].map(btn => (
          <button key={btn.label} onClick={btn.fn} disabled={!!loading}
            style={{ padding: '10px 14px', cursor: loading ? 'wait' : 'pointer', backgroundColor: loading === btn.label ? '#ccc' : btn.color, color: 'white', border: 'none', borderRadius: '4px', fontSize: '13px' }}>
            {loading === btn.label ? 'Running...' : btn.label}
          </button>
        ))}
        <button onClick={() => setTimings([])}
          style={{ padding: '10px 14px', cursor: 'pointer', backgroundColor: '#757575', color: 'white', border: 'none', borderRadius: '4px' }}>
          Clear
        </button>
      </div>

      {/* Bar chart */}
      {timings.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h2>Results</h2>
          {timings.map((t, i) => (
            <div key={i} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '14px' }}>
                <span>{t.label}</span>
                <strong>{t.duration}ms</strong>
              </div>
              <div style={{ backgroundColor: '#f0f0f0', borderRadius: '4px', height: '24px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${(t.duration / maxDuration) * 100}%`,
                  backgroundColor: t.duration === Math.min(...timings.map(x => x.duration)) ? '#388e3c' : '#1976d2',
                  transition: 'width 0.3s',
                  display: 'flex', alignItems: 'center', paddingLeft: '8px', color: 'white', fontSize: '12px'
                }}>
                  {t.duration}ms
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <h3>Performance insights:</h3>
        <ul>
          <li><strong>Sequential:</strong> Each request waits for the previous — slowest</li>
          <li><strong>Promise.all:</strong> All requests fire at once — fastest for small batches</li>
          <li><strong>Concurrency limit:</strong> Batches of N — balance between speed and server load</li>
          <li><strong>Fetch vs Axios:</strong> Similar raw performance — choice depends on features needed</li>
          <li><strong>Axios instance:</strong> Connection reuse — marginal benefit vs creating each time</li>
        </ul>
      </div>
    </div>
  );
}
