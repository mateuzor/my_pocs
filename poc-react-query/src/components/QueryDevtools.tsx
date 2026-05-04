import { useQuery, useQueryClient } from '@tanstack/react-query';

// React Query Devtools adds a floating panel (bottom of screen) showing:
// - All active query keys and their status (fresh / stale / fetching / inactive)
// - Cache data for each query (inspect the JSON)
// - Last updated time, observers count, and retry state
//
// It's added ONCE at the root inside QueryClientProvider (see App.tsx).
// Only included in development builds — the import is tree-shaken in production.

interface Post { id: number; title: string; }
interface User { id: number; name: string; }

async function fetchPost(): Promise<Post> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts/1');
  return res.json();
}

async function fetchUser(): Promise<User> {
  const res = await fetch('https://jsonplaceholder.typicode.com/users/1');
  return res.json();
}

export function QueryDevtools() {
  const queryClient = useQueryClient();

  // Two separate queries — both visible in the Devtools panel
  const post = useQuery<Post>(['devtools-post'], fetchPost, { staleTime: 10_000 });
  const user = useQuery<User>(['devtools-user'], fetchUser, { staleTime: 60_000 });

  const cacheKeys = queryClient.getQueryCache().getAll().map(q => q.queryKey);

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>React Query — Devtools</h2>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        Open the <strong>React Query</strong> panel at the bottom of the screen (the TanStack logo).
        It shows every query key, its status, and the cached data in real time.
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem' }}>
          <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.9rem' }}>Query: <code>['devtools-post']</code></h4>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#555' }}>
            {post.isLoading ? 'Loading...' : post.data?.title}
          </p>
        </div>
        <div style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem' }}>
          <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.9rem' }}>Query: <code>['devtools-user']</code></h4>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#555' }}>
            {user.isLoading ? 'Loading...' : user.data?.name}
          </p>
        </div>
      </div>

      <div style={{ background: '#f7fafc', borderRadius: '6px', padding: '0.75rem', fontSize: '0.85rem' }}>
        <strong>Keys currently in cache ({cacheKeys.length}):</strong>
        <ul style={{ margin: '0.4rem 0 0', paddingLeft: '1.2rem' }}>
          {cacheKeys.map((key, i) => (
            <li key={i}><code>{JSON.stringify(key)}</code></li>
          ))}
        </ul>
      </div>
    </div>
  );
}
