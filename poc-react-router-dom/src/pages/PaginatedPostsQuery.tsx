import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

interface Post {
  id: number;
  title: string;
  body: string;
}

const PAGE_SIZE = 5;
const TOTAL_POSTS = 100; // jsonplaceholder has 100 posts
const TOTAL_PAGES = Math.ceil(TOTAL_POSTS / PAGE_SIZE);

async function fetchPostsPage(page: number): Promise<Post[]> {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${PAGE_SIZE}`
  );
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export function PaginatedPostsQuery() {
  // Page number lives in the URL — bookmarkable, shareable, and works with browser back
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') ?? '1');

  const { data: posts, isLoading, isPlaceholderData } = useQuery({
    queryKey: ['posts', 'paginated', page], // each page is cached under its own key
    queryFn: () => fetchPostsPage(page),
    placeholderData: keepPreviousData, // show old page while next page is loading
  });

  const goToPage = (newPage: number) => {
    setSearchParams({ page: String(newPage) });
  };

  if (isLoading) return <p style={{ padding: '2rem' }}>Loading...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Paginated Posts</h2>
      <p style={{ color: '#888', fontSize: '0.9rem' }}>Page is stored in URL — try refreshing or sharing the link</p>

      {/* Dim the list while the next page is still fetching */}
      <div style={{ opacity: isPlaceholderData ? 0.5 : 1 }}>
        {posts?.map((post) => (
          <div key={post.id} style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>
            <strong>{post.title}</strong>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', alignItems: 'center' }}>
        <button onClick={() => goToPage(page - 1)} disabled={page === 1}>
          ← Prev
        </button>
        <span>Page {page} of {TOTAL_PAGES}</span>
        <button onClick={() => goToPage(page + 1)} disabled={page === TOTAL_PAGES}>
          Next →
        </button>
      </div>
    </div>
  );
}
