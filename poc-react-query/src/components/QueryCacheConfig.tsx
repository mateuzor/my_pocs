import { useQuery } from '@tanstack/react-query';

// staleTime: how long data is considered "fresh".
//   During this window, React Query serves the cache and skips the network request.
// cacheTime: how long INACTIVE query data stays in memory before being garbage collected.
//   (default: 5 minutes) — applies after the component that uses the query unmounts.

interface Post {
  id: number;
  title: string;
}

async function fetchPost(id: number): Promise<Post> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  return res.json();
}

function QueryCard({
  postId,
  staleTime,
  cacheTime,
  label,
  description,
}: {
  postId: number;
  staleTime: number;
  cacheTime: number;
  label: string;
  description: string;
}) {
  const { data, isLoading, isFetching, dataUpdatedAt } = useQuery(
    [`post-cache-${postId}`],
    () => fetchPost(postId),
    { staleTime, cacheTime }
  );

  const ageSeconds = dataUpdatedAt ? Math.floor((Date.now() - dataUpdatedAt) / 1000) : null;

  return (
    <div style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
      <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem' }}>{label}</h4>
      <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', color: '#666' }}>{description}</p>
      {isLoading && <p style={{ margin: 0 }}>Loading...</p>}
      {data && (
        <p style={{ fontSize: '0.85rem', margin: '0 0 0.5rem', fontStyle: 'italic' }}>
          "{data.title}"
        </p>
      )}
      {ageSeconds !== null && (
        <p style={{ fontSize: '0.8rem', color: '#718096', margin: 0 }}>
          Fetched {ageSeconds}s ago {isFetching && <span style={{ color: '#4299e1' }}>(refetching...)</span>}
        </p>
      )}
    </div>
  );
}

export function QueryCacheConfig() {
  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>React Query — staleTime & cacheTime</h2>
      <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Switch to another browser tab and come back — the left card refetches on window focus,
        the right card skips the request because its data is still fresh.
      </p>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <QueryCard
          postId={1}
          staleTime={0}
          cacheTime={300_000}
          label="Always stale"
          description="staleTime: 0 — data is stale immediately after fetch. Refetches on every window focus."
        />
        <QueryCard
          postId={2}
          staleTime={60_000}
          cacheTime={300_000}
          label="Fresh for 60 seconds"
          description="staleTime: 60000 — no refetch for 60s. Switch tabs and return within that window to see it skip."
        />
      </div>

      <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f7fafc', borderRadius: '6px', fontSize: '0.85rem', color: '#4a5568' }}>
        <strong>Rule of thumb:</strong> set <code>staleTime</code> to match how often your data actually changes.
        Reference data (countries, categories) can be hours; user feeds should be seconds.
      </div>
    </div>
  );
}
