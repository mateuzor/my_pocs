import { useState, useEffect, useRef, useCallback } from 'react';

// Simulate a paginated data source
function generateItems(page, pageSize = 10) {
  return Array.from({ length: pageSize }, (_, i) => ({
    id: page * pageSize + i + 1,
    title: `Item #${page * pageSize + i + 1}`,
    color: `hsl(${((page * pageSize + i) * 37) % 360}, 70%, 85%)`,
  }));
}

export function InfiniteScroll() {
  const [items, setItems] = useState(() => generateItems(0));
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef(null);

  // Load the next page of items — simulates an API call with a delay
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600));

    const newItems = generateItems(page);
    setItems((prev) => [...prev, ...newItems]);
    setPage((p) => p + 1);

    // Stop after 5 pages for demo purposes
    if (page >= 4) setHasMore(false);
    setLoading(false);
  }, [loading, hasMore, page]);

  useEffect(() => {
    // The sentinel is an invisible element at the bottom of the list
    // When it enters the viewport, IntersectionObserver fires and we load more
    const observer = new IntersectionObserver(
      (entries) => {
        // isIntersecting becomes true when the sentinel is visible
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 } // fire when 10% of the sentinel is visible
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);

    // Cleanup: disconnect observer when component unmounts or deps change
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>Infinite Scroll</h3>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>Scroll down — new items load automatically when the sentinel enters the viewport.</p>

      <div style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '1rem' }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              padding: '0.75rem 1rem',
              marginBottom: '0.5rem',
              background: item.color,
              borderRadius: '6px',
            }}
          >
            {item.title}
          </div>
        ))}

        {/* Sentinel: invisible element watched by the observer */}
        <div ref={sentinelRef} style={{ height: '1px' }} />

        {loading && <p style={{ textAlign: 'center', color: '#888' }}>Loading...</p>}
        {!hasMore && <p style={{ textAlign: 'center', color: '#aaa' }}>All items loaded</p>}
      </div>
    </div>
  );
}
