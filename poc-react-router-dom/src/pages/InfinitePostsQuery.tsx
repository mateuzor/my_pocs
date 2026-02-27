import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

interface Post {
  id: number;
  title: string;
  body: string;
}

const PAGE_SIZE = 8;

// pageParam is injected by TanStack Query — starts at initialPageParam, then uses getNextPageParam
async function fetchPostsInfinite({ pageParam }: { pageParam: number }): Promise<{
  posts: Post[];
  nextPage: number | null;
}> {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=${PAGE_SIZE}`
  );
  if (!res.ok) throw new Error('Failed to fetch');
  const posts: Post[] = await res.json();
  return {
    posts,
    // returning null tells TanStack there are no more pages to load
    nextPage: posts.length === PAGE_SIZE ? pageParam + 1 : null,
  };
}

export function InfinitePostsQuery() {
  const bottomRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['posts', 'infinite'],
    queryFn: fetchPostsInfinite,
    initialPageParam: 1,
    // Return the next page number — or null when all pages are loaded
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  // IntersectionObserver fires when the sentinel div scrolls into view
  // triggering the next page fetch automatically
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <p style={{ padding: '2rem' }}>Loading...</p>;

  // Flatten all pages into a single array for rendering
  const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Infinite Scroll</h2>
      <p style={{ color: '#888', fontSize: '0.9rem' }}>Scroll down to load more posts automatically</p>

      {allPosts.map((post) => (
        <div key={post.id} style={{ padding: '0.75rem', borderBottom: '1px solid #eee', marginBottom: '0.5rem' }}>
          <strong>{post.title}</strong>
          <p style={{ color: '#666', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>{post.body}</p>
        </div>
      ))}

      {/* Sentinel — when visible, the observer triggers the next page fetch */}
      <div ref={bottomRef} style={{ padding: '1rem', textAlign: 'center', color: '#888' }}>
        {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Scroll for more' : 'All posts loaded'}
      </div>
    </div>
  );
}
