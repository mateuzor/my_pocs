import { useState } from 'react';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

interface RetryLog { attempt: number; status?: number; error: string; delay: number; }

// Axios with retry logic via interceptors
function createRetryApi(maxRetries: number, onLog: (log: RetryLog) => void): AxiosInstance {
  const instance = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 5000,
  });

  instance.interceptors.response.use(
    res => res,
    async (error) => {
      const config = error.config as AxiosRequestConfig & { _retryCount?: number };
      config._retryCount = config._retryCount ?? 0;

      const status = error.response?.status;
      const isRetryable = !status || status >= 500 || status === 429;

      if (config._retryCount >= maxRetries || !isRetryable) {
        onLog({ attempt: config._retryCount!, status, error: error.message, delay: 0 });
        return Promise.reject(error);
      }

      config._retryCount += 1;
      const delay = Math.pow(2, config._retryCount) * 300; // exponential: 600ms, 1200ms, 2400ms

      onLog({ attempt: config._retryCount, status, error: error.message, delay });

      await new Promise(resolve => setTimeout(resolve, delay));
      return instance(config);
    }
  );

  return instance;
}

export default function AxiosRetryDemo() {
  const [maxRetries, setMaxRetries] = useState(3);
  const [logs, setLogs] = useState<RetryLog[]>([]);
  const [finalStatus, setFinalStatus] = useState<'idle' | 'loading' | 'success' | 'failed'>('idle');
  const [scenario, setScenario] = useState<'success' | '500' | '404'>('500');

  const run = async () => {
    setLogs([]);
    setFinalStatus('loading');

    const api = createRetryApi(maxRetries, (log) => {
      setLogs(prev => [...prev, log]);
    });

    try {
      let url = '/posts/1';
      if (scenario === '500') url = 'https://httpstat.us/500';
      if (scenario === '404') url = '/posts/99999'; // 404 - not retryable

      const res = scenario === '500' || scenario === '404'
        ? await axios.get(url, { timeout: 5000 })
        : await api.get(url);

      if (!res) throw new Error('No response');
      setFinalStatus('success');
    } catch {
      setFinalStatus('failed');
    }
  };

  const runWithRetry = async () => {
    setLogs([]);
    setFinalStatus('loading');

    const api = createRetryApi(maxRetries, (log) => {
      setLogs(prev => [...prev, log]);
    });

    try {
      const url = scenario === 'success'
        ? '/posts/1'
        : scenario === '500'
          ? 'https://httpstat.us/500'
          : '/posts/99999';

      await api.get(url);
      setFinalStatus('success');
    } catch {
      setFinalStatus('failed');
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Axios - Retry with Exponential Backoff</h1>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
        <p style={{ margin: 0 }}>
          Retry logic is implemented via <strong>response interceptors</strong>.
          Exponential backoff: delay doubles with each retry (300ms × 2^attempt).
          Only retries on 5xx or network errors — not on 4xx (client errors).
        </p>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Scenario:</label>
          <select value={scenario} onChange={e => setScenario(e.target.value as any)}
            style={{ padding: '8px', fontSize: '14px' }}>
            <option value="success">✅ Success (will succeed on 1st try)</option>
            <option value="500">❌ 500 Server Error (retryable)</option>
            <option value="404">⚠️ 404 Not Found (NOT retryable)</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Max retries:</label>
          <input type="number" value={maxRetries} min={1} max={4}
            onChange={e => setMaxRetries(Number(e.target.value))}
            style={{ padding: '8px', width: '70px' }} />
        </div>
        <button onClick={runWithRetry} disabled={finalStatus === 'loading'}
          style={{ padding: '10px 24px', cursor: 'pointer', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '4px' }}>
          {finalStatus === 'loading' ? 'Running...' : 'Run with retry'}
        </button>
      </div>

      {/* Timeline */}
      {(logs.length > 0 || finalStatus !== 'idle') && (
        <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#1e1e1e', borderRadius: '8px', fontFamily: 'monospace', fontSize: '13px' }}>
          <p style={{ color: '#888', marginTop: 0 }}>Retry log:</p>
          {logs.map((log, i) => (
            <div key={i} style={{ marginBottom: '6px', color: '#f39c12' }}>
              ⚠️ Attempt {log.attempt} failed
              {log.status && <span style={{ color: '#e74c3c' }}> (HTTP {log.status})</span>}
              <span style={{ color: '#666' }}> — retrying in {log.delay}ms...</span>
            </div>
          ))}
          {finalStatus === 'success' && <div style={{ color: '#2ecc71' }}>✅ Request succeeded!</div>}
          {finalStatus === 'failed' && <div style={{ color: '#e74c3c' }}>❌ Failed after {maxRetries} retries</div>}
          {finalStatus === 'loading' && <div style={{ color: '#3498db' }}>⏳ Waiting...</div>}
        </div>
      )}

      <div style={{ padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <h3>Retry patterns:</h3>
        <ul>
          <li><strong>Interceptor-based</strong> — transparent retry, no change in calling code</li>
          <li><strong>_retryCount</strong> — track attempts in config object</li>
          <li><strong>Exponential backoff</strong> — 600ms, 1200ms, 2400ms... reduces server pressure</li>
          <li><strong>Retryable errors</strong> — 5xx and network errors; skip 4xx (client's fault)</li>
          <li><strong>429 Too Many Requests</strong> — retryable, ideally use Retry-After header</li>
        </ul>
      </div>
    </div>
  );
}
