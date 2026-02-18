import { useState } from 'react';
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

interface LogEntry {
  type: 'request' | 'response' | 'error';
  message: string;
  timestamp: string;
}

// Factory to create an axios instance with observable interceptors
function createApiWithInterceptors(onLog: (entry: LogEntry) => void): AxiosInstance {
  const instance = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 5000,
  });

  // REQUEST interceptor — runs before every request
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('auth_token') ?? 'demo-token-abc123';

      // Inject auth token into every request
      config.headers['Authorization'] = `Bearer ${token}`;

      // Add request timestamp
      (config as any).metadata = { startTime: Date.now() };

      onLog({
        type: 'request',
        message: `→ ${config.method?.toUpperCase()} ${config.url} | Auth: Bearer ${token.slice(0, 15)}...`,
        timestamp: new Date().toLocaleTimeString(),
      });

      return config;
    },
    (error) => {
      onLog({ type: 'error', message: `Request setup error: ${error.message}`, timestamp: new Date().toLocaleTimeString() });
      return Promise.reject(error);
    }
  );

  // RESPONSE interceptor — runs after every response
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      const duration = Date.now() - (response.config as any).metadata?.startTime;
      onLog({
        type: 'response',
        message: `← ${response.status} ${response.config.url} | ${duration}ms | ${JSON.stringify(response.data).slice(0, 60)}...`,
        timestamp: new Date().toLocaleTimeString(),
      });
      return response;
    },
    (error) => {
      // Handle 401 globally
      if (error.response?.status === 401) {
        onLog({ type: 'error', message: '← 401 Unauthorized — redirecting to login...', timestamp: new Date().toLocaleTimeString() });
        // In real app: window.location.href = '/login'
      } else {
        onLog({
          type: 'error',
          message: `← ${error.response?.status ?? 'Network'} Error: ${error.message}`,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

export default function AxiosInterceptorsDemo() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (entry: LogEntry) => setLogs(prev => [entry, ...prev].slice(0, 20));

  const api = createApiWithInterceptors(addLog);

  const makeRequest = async (type: 'success' | 'error') => {
    setLoading(true);
    try {
      if (type === 'success') {
        await api.get('/posts/1');
      } else {
        await api.get('/posts/99999'); // 404
      }
    } catch {
      // errors already logged by interceptor
    } finally {
      setLoading(false);
    }
  };

  const logColor = (type: LogEntry['type']) => ({
    request: '#1976d2',
    response: '#388e3c',
    error: '#c62828',
  }[type]);

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Axios - Interceptors</h1>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
        <p style={{ margin: 0 }}>
          Interceptors run on <strong>every</strong> request/response automatically.
          Perfect for auth tokens, logging, error handling, and request timing.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <button
          onClick={() => makeRequest('success')}
          disabled={loading}
          style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#388e3c', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Make successful request
        </button>
        <button
          onClick={() => makeRequest('error')}
          disabled={loading}
          style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#c62828', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Make failing request (404)
        </button>
        <button
          onClick={() => setLogs([])}
          style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#757575', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Clear log
        </button>
      </div>

      {/* Live log */}
      <div style={{ backgroundColor: '#1e1e1e', borderRadius: '8px', padding: '20px', minHeight: '200px', fontFamily: 'monospace', fontSize: '13px' }}>
        <p style={{ color: '#888', marginTop: 0 }}>Interceptor log:</p>
        {logs.length === 0 && <p style={{ color: '#555' }}>No requests yet. Click a button above.</p>}
        {logs.map((log, i) => (
          <div key={i} style={{ marginBottom: '6px', color: logColor(log.type) }}>
            <span style={{ color: '#666' }}>{log.timestamp} </span>
            <span style={{ color: logColor(log.type) }}>[{log.type.toUpperCase()}]</span>{' '}
            <span style={{ color: '#ccc' }}>{log.message}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <h3>Interceptors patterns:</h3>
        <ul>
          <li><strong>Request interceptor</strong> — inject auth tokens, add timestamps, transform requests</li>
          <li><strong>Response interceptor</strong> — log responses, measure duration, transform data</li>
          <li><strong>Error interceptor</strong> — handle 401 (redirect to login), 429 (rate limit), 500 globally</li>
          <li><strong>instance.interceptors.request.use(onFulfilled, onRejected)</strong> — both params optional</li>
          <li><strong>eject</strong> — remove interceptor when no longer needed</li>
        </ul>
      </div>
    </div>
  );
}
