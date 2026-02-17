import { useState, useEffect, useRef } from 'react';

interface Post {
  id: number;
  title: string;
  body: string;
}

export default function FetchAbortDemo() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'aborted' | 'done'>('idle');
  const abortRef = useRef<AbortController | null>(null);

  // Pattern 1: abort on unmount via useEffect cleanup
  useEffect(() => {
    if (!query) {
      setResults([]);
      setStatus('idle');
      return;
    }

    // Cancel previous request before starting a new one
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus('loading');

    fetch('https://jsonplaceholder.typicode.com/posts', {
      signal: controller.signal,
    })
      .then(res => res.json())
      .then((posts: Post[]) => {
        const filtered = posts.filter(p =>
          p.title.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setStatus('done');
      })
      .catch(err => {
        if (err.name === 'AbortError') {
          setStatus('aborted');
        }
      });

    // Cleanup: abort if query changes before response arrives
    return () => controller.abort();
  }, [query]);

  // Pattern 2: manual cancel button
  const [longRunning, setLongRunning] = useState<'idle' | 'loading' | 'done' | 'cancelled'>('idle');
  const longAbortRef = useRef<AbortController | null>(null);

  const startLongRequest = async () => {
    longAbortRef.current?.abort();
    const controller = new AbortController();
    longAbortRef.current = controller;
    setLongRunning('loading');

    try {
      // Simulate slow request with a real fetch + artificial delay
      const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
        signal: controller.signal,
      });
      // Simulate slow processing
      await new Promise((resolve, reject) => {
        const timer = setTimeout(resolve, 3000);
        controller.signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(new DOMException('Aborted', 'AbortError'));
        });
      });
      await res.json();
      setLongRunning('done');
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setLongRunning('cancelled');
      }
    }
  };

  const cancelLongRequest = () => {
    longAbortRef.current?.abort();
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Fetch API - AbortController</h1>

      {/* Pattern 1: abort on re-render (search) */}
      <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
        <h2>Pattern 1: Cancel on new request (search)</h2>
        <p style={{ color: '#666', fontSize: '14px' }}>Each keystroke cancels the previous request — only the latest matters.</p>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search posts by title..."
          style={{ padding: '10px', width: '100%', boxSizing: 'border-box', marginBottom: '10px' }}
        />
        <p style={{ color: '#666', fontSize: '13px' }}>
          Status: <strong>{status}</strong> {status === 'aborted' && '(previous request cancelled)'}
        </p>
        {results.length > 0 && (
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {results.slice(0, 10).map(p => (
              <div key={p.id} style={{ padding: '8px', borderBottom: '1px solid #ddd', fontSize: '14px' }}>
                {p.title}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pattern 2: manual cancel */}
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#fce4ec', borderRadius: '8px' }}>
        <h2>Pattern 2: Manual cancel button</h2>
        <p style={{ color: '#666', fontSize: '14px' }}>Simulates a 3-second request that can be manually cancelled.</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={startLongRequest}
            disabled={longRunning === 'loading'}
            style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            {longRunning === 'loading' ? 'Loading... (3s)' : 'Start slow request'}
          </button>
          {longRunning === 'loading' && (
            <button
              onClick={cancelLongRequest}
              style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              Cancel
            </button>
          )}
        </div>
        {longRunning === 'done' && <p style={{ color: 'green', marginTop: '10px' }}>✅ Request completed!</p>}
        {longRunning === 'cancelled' && <p style={{ color: 'red', marginTop: '10px' }}>❌ Request cancelled by user.</p>}
      </div>

      <div style={{ padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <h3>AbortController patterns:</h3>
        <ul>
          <li><strong>new AbortController()</strong> — creates controller with a signal</li>
          <li><strong>fetch(url, {'{'} signal {'}'})</strong> — pass signal to link fetch to controller</li>
          <li><strong>controller.abort()</strong> — cancels the request</li>
          <li><strong>err.name === 'AbortError'</strong> — detect cancellation vs real errors</li>
          <li><strong>useEffect cleanup</strong> — call abort() in return to cancel on unmount</li>
        </ul>
      </div>
    </div>
  );
}
