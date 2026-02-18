import { useState } from 'react';
import axios from 'axios';

// Instance 1: Public API — no auth, short timeout
const publicApi = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 5000,
  headers: { 'Accept': 'application/json' },
});

// Instance 2: Authenticated API — with token, longer timeout
const authApi = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer super-secret-token',
  },
});

// Instance 3: Upload API — different Content-Type, large timeout
const uploadApi = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 30000,
  headers: { 'Content-Type': 'multipart/form-data' },
});

// Add response interceptor only to authApi
authApi.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      console.warn('Auth token expired — logging out');
    }
    return Promise.reject(err);
  }
);

interface RequestResult {
  instance: string;
  url: string;
  status: number;
  data: string;
  headers: Record<string, string>;
}

export default function AxiosInstancesDemo() {
  const [results, setResults] = useState<RequestResult[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  const addResult = (result: RequestResult) => {
    setResults(prev => [result, ...prev].slice(0, 6));
  };

  const callPublicApi = async () => {
    setLoading('public');
    try {
      const res = await publicApi.get('/posts/1');
      addResult({
        instance: 'publicApi',
        url: '/posts/1',
        status: res.status,
        data: res.data.title,
        headers: { Authorization: res.config.headers['Authorization'] ?? 'none' },
      });
    } finally { setLoading(null); }
  };

  const callAuthApi = async () => {
    setLoading('auth');
    try {
      const res = await authApi.get('/users/1');
      addResult({
        instance: 'authApi',
        url: '/users/1',
        status: res.status,
        data: res.data.name,
        headers: { Authorization: res.config.headers['Authorization'] },
      });
    } finally { setLoading(null); }
  };

  const callUploadApi = async () => {
    setLoading('upload');
    try {
      const res = await uploadApi.post('/posts', { title: 'Upload test', body: 'content', userId: 1 });
      addResult({
        instance: 'uploadApi',
        url: 'POST /posts',
        status: res.status,
        data: `Created post #${res.data.id}`,
        headers: { 'Content-Type': res.config.headers['Content-Type'] },
      });
    } finally { setLoading(null); }
  };

  // Runtime defaults — change for all future requests
  const setGlobalDefaults = () => {
    axios.defaults.headers.common['X-App-Version'] = '2.0.0';
    axios.defaults.timeout = 8000;
    alert('Global defaults updated: X-App-Version=2.0.0, timeout=8000ms');
  };

  const instanceColor = (name: string) => {
    if (name === 'publicApi') return '#1976d2';
    if (name === 'authApi') return '#388e3c';
    return '#7b1fa2';
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Axios - Instances & Defaults</h1>

      {/* Instance overview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '30px' }}>
        {[
          { name: 'publicApi', color: '#e3f2fd', desc: 'No auth, 5s timeout', label: 'Public API' },
          { name: 'authApi', color: '#e8f5e9', desc: 'Bearer token, 10s timeout + 401 interceptor', label: 'Auth API' },
          { name: 'uploadApi', color: '#f3e5f5', desc: 'multipart/form-data, 30s timeout', label: 'Upload API' },
        ].map(inst => (
          <div key={inst.name} style={{ padding: '15px', backgroundColor: inst.color, borderRadius: '8px' }}>
            <strong style={{ fontSize: '13px' }}>{inst.label}</strong>
            <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#555' }}>{inst.desc}</p>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <button onClick={callPublicApi} disabled={!!loading}
          style={{ padding: '10px 16px', cursor: 'pointer', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '4px' }}>
          {loading === 'public' ? 'Loading...' : 'Call publicApi'}
        </button>
        <button onClick={callAuthApi} disabled={!!loading}
          style={{ padding: '10px 16px', cursor: 'pointer', backgroundColor: '#388e3c', color: 'white', border: 'none', borderRadius: '4px' }}>
          {loading === 'auth' ? 'Loading...' : 'Call authApi'}
        </button>
        <button onClick={callUploadApi} disabled={!!loading}
          style={{ padding: '10px 16px', cursor: 'pointer', backgroundColor: '#7b1fa2', color: 'white', border: 'none', borderRadius: '4px' }}>
          {loading === 'upload' ? 'Loading...' : 'Call uploadApi'}
        </button>
        <button onClick={setGlobalDefaults}
          style={{ padding: '10px 16px', cursor: 'pointer', backgroundColor: '#f57c00', color: 'white', border: 'none', borderRadius: '4px' }}>
          Set global defaults
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h2>Requests</h2>
          {results.map((r, i) => (
            <div key={i} style={{ marginBottom: '10px', padding: '12px', borderRadius: '4px', borderLeft: `4px solid ${instanceColor(r.instance)}`, backgroundColor: '#fafafa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontWeight: 'bold', color: instanceColor(r.instance) }}>{r.instance}</span>
                <span style={{ fontSize: '13px', color: '#666' }}>{r.url} — {r.status}</span>
              </div>
              <div style={{ fontSize: '13px', color: '#555' }}>Data: {r.data}</div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                {Object.entries(r.headers).map(([k, v]) => `${k}: ${v}`).join(' | ')}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <h3>Instances & Defaults patterns:</h3>
        <ul>
          <li><strong>axios.create(config)</strong> — isolated instance with its own defaults</li>
          <li><strong>Multiple instances</strong> — different baseURLs, tokens, timeouts per API</li>
          <li><strong>axios.defaults</strong> — global defaults applied to all instances</li>
          <li><strong>instance.defaults</strong> — per-instance defaults, override global</li>
          <li><strong>Per-request config</strong> — highest priority, overrides instance defaults</li>
        </ul>
      </div>
    </div>
  );
}
