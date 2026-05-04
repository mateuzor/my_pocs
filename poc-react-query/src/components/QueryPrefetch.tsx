import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

// Prefetching: populate the cache before the user navigates to a screen.
// queryClient.prefetchQuery runs in the background — no loading state is triggered.
// When the user actually requests the data, it's already in cache and renders instantly.

interface Post {
  id: number;
  title: string;
  body: string;
}

async function fetchPost(id: number): Promise<Post> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  return res.json();
}

const POST_IDS = [1, 2, 3, 4, 5];

export function QueryPrefetch() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  // Prefetch on hover — data is ready before the click happens
  const handleMouseEnter = (id: number) => {
    queryClient.prefetchQuery(
      [`prefetch-post-${id}`],
      () => fetchPost(id),
      { staleTime: 30_000 } // skip prefetch if data is already fresh in cache
    );
  };

  const { data, isLoading } = useQuery(
    [`prefetch-post-${selectedId}`],
    () => fetchPost(selectedId!),
    { enabled: !!selectedId, staleTime: 30_000 }
  );

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>React Query — Prefetching</h2>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        Hover a button to prefetch silently. Click to select — data loads from cache instantly
        with no loading spinner.
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {POST_IDS.map(id => (
          <button
            key={id}
            onMouseEnter={() => handleMouseEnter(id)}
            onClick={() => setSelectedId(id)}
            style={{
              background: selectedId === id ? '#4299e1' : undefined,
              color: selectedId === id ? 'white' : undefined,
              padding: '0.4rem 0.9rem',
            }}
          >
            Post #{id}
          </button>
        ))}
      </div>

      {selectedId && (
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
          {isLoading ? (
            <p style={{ margin: 0 }}>Loading...</p>
          ) : (
            <>
              <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.95rem' }}>{data?.title}</h4>
              <p style={{ color: '#555', fontSize: '0.9rem', margin: 0 }}>{data?.body}</p>
            </>
          )}
        </div>
      )}

      <p style={{ fontSize: '0.8rem', color: '#718096', marginTop: '0.75rem' }}>
        Common pattern: prefetch on hover for lists, or prefetch the next page during pagination.
      </p>
    </div>
  );
}
