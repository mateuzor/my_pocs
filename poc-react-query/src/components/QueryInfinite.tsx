import { useInfiniteQuery } from '@tanstack/react-query';

// useInfiniteQuery stores each page separately in the cache.
// getNextPageParam tells React Query what to pass as pageParam on the next fetch.
// data.pages is an array of page results — flatten it to get all items.

interface Post {
  id: number;
  title: string;
  body: string;
}

const PAGE_SIZE = 5;

async function fetchPostsPage({ pageParam = 1 }: { pageParam?: number }) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=${PAGE_SIZE}`
  );
  const posts: Post[] = await res.json();
  // jsonplaceholder has 100 posts total
  const nextPage = pageParam * PAGE_SIZE < 100 ? pageParam + 1 : null;
  return { posts, nextPage };
}

export function QueryInfinite() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(
    ['infinite-posts'],
    fetchPostsPage,
    {
      // Return value is passed as pageParam to the next call.
      // Returning undefined signals there are no more pages.
      getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    }
  );

  // data.pages is an array of page objects — flatten to get a single list
  const allPosts = data?.pages.flatMap(page => page.posts) ?? [];

  if (isLoading) return <p style={{ padding: '1.5rem' }}>Loading...</p>;

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>React Query — useInfiniteQuery</h2>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        Each page is cached independently. Clicking "Load more" appends the next page
        without re-fetching previous ones.
      </p>

      <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1rem' }}>
        {allPosts.map(post => (
          <li key={post.id} style={{
            padding: '0.5rem 0',
            borderBottom: '1px solid #eee',
            fontSize: '0.9rem',
          }}>
            <strong>#{post.id}</strong> {post.title}
          </li>
        ))}
      </ul>

      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? 'Loading...'
          : hasNextPage
          ? 'Load more'
          : 'All posts loaded'}
      </button>

      <p style={{ fontSize: '0.85rem', color: '#718096', marginTop: '0.5rem' }}>
        {allPosts.length} posts loaded across {data?.pages.length} page(s)
      </p>
    </div>
  );
}
