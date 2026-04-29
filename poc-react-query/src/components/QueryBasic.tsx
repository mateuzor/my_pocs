import { useQuery } from '@tanstack/react-query';

// useQuery is the core primitive of React Query.
// It fetches data, caches it by key, deduplicates concurrent requests,
// and tracks loading/error/stale state automatically.

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

async function fetchPosts(): Promise<Post[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=8');
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export function QueryBasic() {
  const {
    data,
    isLoading,   // true only on the very first load (no cached data yet)
    isError,
    error,
    isFetching,  // true whenever a request is in-flight (including background refetches)
    refetch,
  } = useQuery<Post[], Error>(
    ['posts'],     // query key — uniquely identifies this query in the cache
    fetchPosts,
    { staleTime: 30_000 } // data stays "fresh" for 30s — no refetch during this window
  );

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>React Query — useQuery</h2>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        Query key <code>['posts']</code> is the cache key. Open DevTools Network tab and
        switch tabs — React Query refetches in the background when the window regains focus.
      </p>

      <div style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button onClick={() => refetch()}>Refetch manually</button>
        {isFetching && <span style={{ color: '#718096', fontSize: '0.85rem' }}>Fetching...</span>}
      </div>

      {isLoading && <p>Loading...</p>}
      {isError && <p style={{ color: 'red' }}>Error: {error.message}</p>}

      {data && (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {data.map(post => (
            <li key={post.id} style={{
              padding: '0.5rem 0',
              borderBottom: '1px solid #eee',
              fontSize: '0.9rem',
            }}>
              <strong>#{post.id}</strong> {post.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
