import { useState } from 'react';

// Fetch with timeout using AbortController + setTimeout
async function fetchWithTimeout(url: string, timeoutMs: number, options?: RequestInit) {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    throw err;
  }
}

// Fetch with retry on failure
async function fetchWithRetry(
  url: string,
  maxRetries: number,
  delayMs: number,
  options?: RequestInit
): Promise<any> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    } catch (err: any) {
      lastError = err;
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt)); // exponential backoff
      }
    }
  }

  throw new Error(`Failed after ${maxRetries} retries: ${lastError!.message}`);
}

type DemoStatus = 'idle' | 'loading' | 'success' | 'error';

export default function FetchTimeoutDemo() {
  const [timeout, setTimeout_] = useState(2000);
  const [timeoutStatus, setTimeoutStatus] = useState<DemoStatus>('idle');
  const [timeoutMsg, setTimeoutMsg] = useState('');

  const [retries, setRetries] = useState(3);
  const [retryStatus, setRetryStatus] = useState<DemoStatus>('idle');
  const [retryMsg, setRetryMsg] = useState('');
  const [retryLog, setRetryLog] = useState<string[]>([]);

  const runTimeoutDemo = async (willTimeout: boolean) => {
    setTimeoutStatus('loading');
    setTimeoutMsg('');
    try {
      // Use a slow endpoint or fast one depending on scenario
      const url = willTimeout
        ? 'https://httpstat.us/200?sleep=5000' // responds after 5s
        : 'https://jsonplaceholder.typicode.com/posts/1';
      const data = await fetchWithTimeout(url, timeout);
      setTimeoutStatus('success');
      setTimeoutMsg(`✅ Got response! Title: "${data.title ?? 'N/A'}"`);
    } catch (err: any) {
      setTimeoutStatus('error');
      setTimeoutMsg(`❌ ${err.message}`);
    }
  };

  const runRetryDemo = async (willFail: boolean) => {
    setRetryStatus('loading');
    setRetryMsg('');
    setRetryLog([]);

    const logs: string[] = [];
    const url = willFail
      ? 'https://httpstat.us/500' // always fails
      : 'https://jsonplaceholder.typicode.com/posts/1';

    // Wrap to capture retry logs
    let attempt = 0;
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      attempt++;
      logs.push(`Attempt ${attempt} — ${new Date().toLocaleTimeString()}`);
      setRetryLog([...logs]);
      return originalFetch(...args);
    };

    try {
      const data = await fetchWithRetry(url, retries, 500);
      setRetryStatus('success');
      setRetryMsg(`✅ Succeeded! Title: "${data.title ?? 'N/A'}"`);
    } catch (err: any) {
      setRetryStatus('error');
      setRetryMsg(`❌ ${err.message}`);
    } finally {
      window.fetch = originalFetch;
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Fetch - Timeout & Retry Patterns</h1>

      {/* Timeout Demo */}
      <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
        <h2>Timeout Pattern</h2>
        <p style={{ color: '#666', fontSize: '14px' }}>AbortController + setTimeout to cancel slow requests automatically.</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
          <label>Timeout (ms):</label>
          <input
            type="number"
            value={timeout}
            onChange={e => setTimeout_(Number(e.target.value))}
            step={500}
            style={{ padding: '8px', width: '100px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <button
            onClick={() => runTimeoutDemo(false)}
            disabled={timeoutStatus === 'loading'}
            style={{ padding: '10px 16px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Fast request (will succeed)
          </button>
          <button
            onClick={() => runTimeoutDemo(true)}
            disabled={timeoutStatus === 'loading'}
            style={{ padding: '10px 16px', cursor: 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Slow request (5s, will timeout)
          </button>
        </div>

        {timeoutStatus === 'loading' && <p>⏳ Waiting... (max {timeout}ms)</p>}
        {timeoutMsg && (
          <p style={{ padding: '10px', borderRadius: '4px', backgroundColor: timeoutStatus === 'success' ? '#e8f5e9' : '#ffebee' }}>
            {timeoutMsg}
          </p>
        )}
      </div>

      {/* Retry Demo */}
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#fce4ec', borderRadius: '8px' }}>
        <h2>Retry with Exponential Backoff</h2>
        <p style={{ color: '#666', fontSize: '14px' }}>Automatically retries failed requests with increasing delays.</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
          <label>Max retries:</label>
          <input
            type="number"
            value={retries}
            onChange={e => setRetries(Number(e.target.value))}
            min={1}
            max={5}
            style={{ padding: '8px', width: '60px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <button
            onClick={() => runRetryDemo(false)}
            disabled={retryStatus === 'loading'}
            style={{ padding: '10px 16px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Request that succeeds
          </button>
          <button
            onClick={() => runRetryDemo(true)}
            disabled={retryStatus === 'loading'}
            style={{ padding: '10px 16px', cursor: 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Request that always fails
          </button>
        </div>

        {retryLog.length > 0 && (
          <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#fff', borderRadius: '4px', fontFamily: 'monospace', fontSize: '13px' }}>
            {retryLog.map((log, i) => <div key={i}>{log}</div>)}
          </div>
        )}
        {retryMsg && (
          <p style={{ padding: '10px', borderRadius: '4px', backgroundColor: retryStatus === 'success' ? '#e8f5e9' : '#ffebee' }}>
            {retryMsg}
          </p>
        )}
      </div>

      <div style={{ padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <h3>Timeout & Retry patterns:</h3>
        <ul>
          <li><strong>Timeout</strong> — setTimeout + controller.abort() after X ms</li>
          <li><strong>clearTimeout</strong> — cancel timeout when request succeeds</li>
          <li><strong>Retry</strong> — loop with try/catch, re-throw after max attempts</li>
          <li><strong>Exponential backoff</strong> — delay increases with each retry (500ms, 1s, 1.5s...)</li>
          <li><strong>Real world</strong> — combine both: retry with timeout per attempt</li>
        </ul>
      </div>
    </div>
  );
}
