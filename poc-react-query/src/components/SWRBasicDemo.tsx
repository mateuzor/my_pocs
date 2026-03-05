import useSWR from 'swr';

interface Post {
  id: number;
  title: string;
  body: string;
}

// fetcher is a plain function — SWR calls it with the key as argument
// Any async function that returns data works as a fetcher
const fetcher = (url: string): Promise<Post[]> =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  });

export function SWRBasicDemo() {
  // useSWR(key, fetcher) — key doubles as the cache key AND the URL
  // SWR = Stale-While-Revalidate: serve cached data first, then revalidate in the background
  const { data, error, isLoading, isValidating } = useSWR<Post[]>(
    'https://jsonplaceholder.typicode.com/posts?_limit=5',
    fetcher
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error.message}</p>;

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>SWR — Basic Fetching</h3>
      {/* isValidating is true during background revalidation (data already shown) */}
      {isValidating && <small style={{ color: '#888' }}>Revalidating...</small>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {data?.map((post) => (
          <li key={post.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
            <strong>{post.title}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
