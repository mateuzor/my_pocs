import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// ✅ Best Practice 1: Centralized API client
const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

// Response interceptor: global error handling
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) console.warn('Unauthorized — redirect to login');
    if (err.response?.status >= 500) console.error('Server error — show retry UI');
    return Promise.reject(err);
  }
);

// ✅ Best Practice 2: Typed service layer
interface Post { id: number; title: string; userId: number; }
interface CreatePostDto { title: string; body: string; userId: number; }

const PostAPI = {
  list: (limit = 5) => api.get<Post[]>('/posts', { params: { _limit: limit } }).then(r => r.data),
  create: (dto: CreatePostDto) => api.post<Post>('/posts', dto).then(r => r.data),
  delete: (id: number) => api.delete(`/posts/${id}`),
};

// ✅ Best Practice 3: Generic useQuery hook (minimal SWR-like)
function useQuery<T>(key: string, fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetcher()
      .then(d => { if (!cancelled) { setData(d); setLoading(false); } })
      .catch(e => { if (!cancelled) { setError(e.message); setLoading(false); } });

    return () => { cancelled = true; };
  }, [key, version]); // eslint-disable-line

  const refetch = useCallback(() => setVersion(v => v + 1), []);
  return { data, loading, error, refetch };
}

// ✅ Best Practice 4: Optimistic update pattern
function useOptimisticList<T extends { id: number }>(initial: T[]) {
  const [items, setItems] = useState<T[]>(initial);

  const optimisticDelete = async (id: number, apiCall: () => Promise<void>) => {
    const backup = items;
    setItems(prev => prev.filter(i => i.id !== id)); // optimistic
    try {
      await apiCall();
    } catch {
      setItems(backup); // rollback on error
    }
  };

  return { items, setItems, optimisticDelete };
}

export default function FetchBestPracticesDemo() {
  const { data: posts, loading, error, refetch } = useQuery('posts', () => PostAPI.list(8));
  const { items, setItems, optimisticDelete } = useOptimisticList<Post>(posts ?? []);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  // Sync items when posts load
  useEffect(() => { if (posts) setItems(posts); }, [posts]); // eslint-disable-line

  const handleCreate = async () => {
    if (!newTitle) return;
    setCreating(true);
    try {
      const post = await PostAPI.create({ title: newTitle, body: 'content', userId: 1 });
      setItems(prev => [post, ...prev]);
      setNewTitle('');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = (id: number) => {
    optimisticDelete(id, () => PostAPI.delete(id).then(() => {}));
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Fetch/Axios Best Practices</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
        {[
          { title: '1. Centralized client', desc: 'axios.create() with baseURL, timeout, interceptors — one place to configure' },
          { title: '2. Typed service layer', desc: 'PostAPI.list(), PostAPI.create() — encapsulate endpoints, expose typed methods' },
          { title: '3. useQuery hook', desc: 'Generic hook: loading/error/data + refetch + cancel on unmount' },
          { title: '4. Optimistic updates', desc: 'Update UI before API confirms — rollback on error for snappy UX' },
        ].map(p => (
          <div key={p.title} style={{ padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
            <strong style={{ fontSize: '13px' }}>{p.title}</strong>
            <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#555' }}>{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Create */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input value={newTitle} onChange={e => setNewTitle(e.target.value)}
          placeholder="New post title..." style={{ padding: '10px', flex: 1 }} />
        <button onClick={handleCreate} disabled={creating || !newTitle}
          style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#388e3c', color: 'white', border: 'none', borderRadius: '4px' }}>
          {creating ? 'Creating...' : 'Create'}
        </button>
        <button onClick={refetch} disabled={loading}
          style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '4px' }}>
          {loading ? '...' : 'Refetch'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {loading && <p>Loading...</p>}

      {/* List with optimistic delete */}
      <div>
        {items.map(post => (
          <div key={post.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', marginBottom: '8px', backgroundColor: '#fafafa', borderRadius: '4px', border: '1px solid #eee' }}>
            <span style={{ fontSize: '14px' }}><strong>#{post.id}</strong> {post.title}</span>
            <button onClick={() => handleDelete(post.id)}
              style={{ padding: '4px 12px', cursor: 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px' }}>
              Delete
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <h3>When to use Fetch vs Axios:</h3>
        <ul>
          <li><strong>Use fetch</strong> — simple scripts, no dependencies, modern Node.js, small bundle critical</li>
          <li><strong>Use axios</strong> — complex apps with auth, need interceptors, progress tracking, legacy Node</li>
          <li><strong>Use React Query / SWR</strong> — production apps needing caching, revalidation, deduplication</li>
        </ul>
      </div>
    </div>
  );
}
