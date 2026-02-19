import { useState, useEffect, useRef } from 'react';
import axios, { CancelTokenSource } from 'axios';

const api = axios.create({ baseURL: 'https://jsonplaceholder.typicode.com', timeout: 8000 });

interface Post { id: number; title: string; }

export default function AxiosCancelDemo() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'cancelled'>('idle');
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);

  // Pattern 1: Cancel on new request (search debounce-like)
  useEffect(() => {
    if (!query) { setResults([]); setStatus('idle'); return; }

    // Cancel previous request
    cancelTokenRef.current?.cancel('New search started');

    const source = axios.CancelToken.source();
    cancelTokenRef.current = source;

    setStatus('loading');

    api.get<Post[]>('/posts', { cancelToken: source.token })
      .then(res => {
        const filtered = res.data.filter(p =>
          p.title.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setStatus('done');
      })
      .catch(err => {
        if (axios.isCancel(err)) {
          setStatus('cancelled');
        }
      });

    return () => source.cancel('Component unmounted or query changed');
  }, [query]);

  // Pattern 2: Manual cancel button
  const [longStatus, setLongStatus] = useState<'idle' | 'loading' | 'done' | 'cancelled'>('idle');
  const longCancelRef = useRef<CancelTokenSource | null>(null);

  const startLong = async () => {
    longCancelRef.current?.cancel('Starting new request');
    const source = axios.CancelToken.source();
    longCancelRef.current = source;
    setLongStatus('loading');

    try {
      // Simulate slow API with sleep endpoint
      await api.get('/posts', {
        cancelToken: source.token,
        params: { _limit: 100 },
      });
      // Artificial delay to simulate slow processing
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(resolve, 3000);
        source.token.promise.then(() => { clearTimeout(timer); reject(new axios.Cancel('Cancelled')); });
      });
      setLongStatus('done');
    } catch (err) {
      if (axios.isCancel(err)) setLongStatus('cancelled');
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Axios - CancelToken & AbortController</h1>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
        <strong>Note:</strong> Axios supports cancellation via <code>CancelToken</code> (legacy) or the native
        <code> AbortController</code> (axios v0.22+). Both achieve the same result.
      </div>

      {/* Pattern 1: Search */}
      <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
        <h2>Pattern 1: Cancel on query change</h2>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search posts..."
          style={{ padding: '10px', width: '100%', boxSizing: 'border-box', marginBottom: '10px' }}
        />
        <p style={{ color: '#666', fontSize: '13px' }}>
          Status: <strong>{status}</strong>
          {status === 'cancelled' && ' — previous request was cancelled automatically'}
        </p>
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {results.slice(0, 8).map(p => (
            <div key={p.id} style={{ padding: '8px', borderBottom: '1px solid #ddd', fontSize: '14px' }}>{p.title}</div>
          ))}
        </div>
      </div>

      {/* Pattern 2: Manual */}
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#fce4ec', borderRadius: '8px' }}>
        <h2>Pattern 2: Manual cancel button</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={startLong} disabled={longStatus === 'loading'}
            style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '4px' }}>
            {longStatus === 'loading' ? 'Loading... (3s)' : 'Start slow request'}
          </button>
          {longStatus === 'loading' && (
            <button onClick={() => longCancelRef.current?.cancel('User cancelled')}
              style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#c62828', color: 'white', border: 'none', borderRadius: '4px' }}>
              Cancel
            </button>
          )}
        </div>
        {longStatus === 'done' && <p style={{ color: 'green', marginTop: '10px' }}>✅ Completed!</p>}
        {longStatus === 'cancelled' && <p style={{ color: 'red', marginTop: '10px' }}>❌ Cancelled by user.</p>}
      </div>

      <div style={{ padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <h3>Cancellation patterns:</h3>
        <ul>
          <li><strong>axios.CancelToken.source()</strong> — creates {'{'} token, cancel() {'}'}</li>
          <li><strong>axios.isCancel(err)</strong> — check if error is a cancellation</li>
          <li><strong>AbortController</strong> — native alternative: <code>signal: controller.signal</code></li>
          <li><strong>useEffect cleanup</strong> — cancel in return function to avoid stale updates</li>
          <li><strong>source.cancel(reason)</strong> — reason is optional but useful for debugging</li>
        </ul>
      </div>
    </div>
  );
}
