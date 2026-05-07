import { useQueries } from '@tanstack/react-query';

// useQueries runs multiple independent queries in parallel.
// Unlike calling useQuery several times in a loop (which violates Rules of Hooks),
// useQueries accepts a dynamic array of query definitions and returns an array of results.

interface Post {
  id: number;
  title: string;
  body: string;
}

async function fetchPost(id: number): Promise<Post> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  return res.json();
}

const POST_IDS = [1, 5, 10, 20, 50];

export function QueryParallel() {
  // All queries fire simultaneously — React Query doesn't wait for one to finish
  // before starting the next. Each has its own cache entry.
  const results = useQueries({
    queries: POST_IDS.map(id => ({
      queryKey: ['parallel-post', id],
      queryFn: () => fetchPost(id),
      staleTime: 60_000,
    })),
  });

  const loadingCount = results.filter(r => r.isLoading).length;
  const doneCount = results.filter(r => r.isSuccess).length;

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>React Query — useQueries (Parallel)</h2>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        {POST_IDS.length} queries fired simultaneously. Each has its own query key,
        cache, and loading state. Useful when fetching a dynamic list of resources.
      </p>

      <p style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '0.75rem' }}>
        {loadingCount > 0
          ? `Loading ${loadingCount} of ${POST_IDS.length}...`
          : `All ${doneCount} queries complete`}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {results.map((result, i) => (
          <div
            key={POST_IDS[i]}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              background: result.isLoading ? '#f7fafc' : '#fff',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <code style={{ fontSize: '0.8rem', color: '#666' }}>
                ['parallel-post', {POST_IDS[i]}]
              </code>
              <span style={{
                fontSize: '0.75rem',
                padding: '2px 8px',
                borderRadius: '12px',
                background: result.isLoading ? '#feebc8' : result.isError ? '#fed7d7' : '#c6f6d5',
                color: result.isLoading ? '#744210' : result.isError ? '#742a2a' : '#22543d',
              }}>
                {result.isLoading ? 'loading' : result.isError ? 'error' : 'success'}
              </span>
            </div>
            {result.data && (
              <p style={{ margin: '0.4rem 0 0', fontSize: '0.875rem', color: '#2d3748' }}>
                {result.data.title}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
