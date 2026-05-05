import { useInfiniteQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useRef } from 'react';

// Combining useInfiniteQuery + useVirtualizer:
// - useInfiniteQuery fetches pages on demand and caches each one separately
// - useVirtualizer renders only the rows currently visible in the viewport
// - When the last virtual item becomes visible, we trigger fetchNextPage

interface Post {
  id: number;
  title: string;
}

const PAGE_SIZE = 10;

async function fetchPage({ pageParam = 1 }: { pageParam?: number }) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=${PAGE_SIZE}`
  );
  const posts: Post[] = await res.json();
  return { posts, nextPage: pageParam * PAGE_SIZE < 100 ? pageParam + 1 : null };
}

export function InfiniteVirtualList() {
  const parentRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['infinite-virtual'],
    fetchPage,
    { getNextPageParam: p => p.nextPage ?? undefined }
  );

  const allPosts = data?.pages.flatMap(p => p.posts) ?? [];

  const virtualizer = useVirtualizer({
    // +1 adds a sentinel row at the end used to trigger the next page fetch
    count: hasNextPage ? allPosts.length + 1 : allPosts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const lastVirtualItem = virtualItems[virtualItems.length - 1];

  // When the sentinel row enters the viewport, load the next page
  useEffect(() => {
    if (!lastVirtualItem) return;
    if (lastVirtualItem.index >= allPosts.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [lastVirtualItem?.index, hasNextPage, isFetchingNextPage, allPosts.length, fetchNextPage, lastVirtualItem]);

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>Infinite Scroll + TanStack Virtual</h2>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        Scroll to the bottom — new pages load automatically.
        Only visible rows are in the DOM; all loaded pages stay in the React Query cache.
      </p>

      <div
        ref={parentRef}
        style={{ height: 400, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}
      >
        <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
          {virtualItems.map(virtualRow => {
            const isSentinel = virtualRow.index >= allPosts.length;
            const post = allPosts[virtualRow.index];

            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: 0,
                  transform: `translateY(${virtualRow.start}px)`,
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid #f0f0f0',
                  boxSizing: 'border-box',
                  fontSize: '0.9rem',
                }}
              >
                {isSentinel ? (
                  <span style={{ color: '#718096' }}>
                    {isFetchingNextPage ? 'Loading more...' : 'No more posts'}
                  </span>
                ) : (
                  <><strong>#{post.id}</strong> {post.title}</>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: '#718096', marginTop: '0.5rem' }}>
        {allPosts.length} posts loaded · {data?.pages.length ?? 0} page(s) in cache
      </p>
    </div>
  );
}
