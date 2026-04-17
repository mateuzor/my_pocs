import { useEffect, useRef, useState, useCallback } from 'react';

// IntersectionObserver: fires when an element enters or leaves the viewport.
// More efficient than listening to scroll events — the browser handles the math.
// Use cases: lazy loading, infinite scroll, reveal-on-scroll animations.

// Custom hook: returns a ref to attach to any element and whether it is visible
function useIntersectionObserver(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    observer.observe(target);
    return () => observer.disconnect();
  }, [options]);

  return { ref, isVisible };
}

// Reveal-on-scroll: element fades in when it enters the viewport
function RevealCard({ index }: { index: number }) {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        padding: '1rem',
        background: '#ebf8ff',
        borderRadius: '8px',
        marginBottom: '0.75rem',
      }}
    >
      Card {index + 1} — reveals when scrolled into view
    </div>
  );
}

// Infinite scroll: a sentinel div at the bottom triggers loading more items
function InfiniteScrollDemo() {
  const [items, setItems] = useState(Array.from({ length: 10 }, (_, i) => i));
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    setItems(prev => [...prev, ...Array.from({ length: 5 }, (_, i) => prev.length + i)]);
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    // When the sentinel enters the viewport, load the next batch
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadMore();
    }, { rootMargin: '100px' }); // trigger 100px before reaching the sentinel

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem' }}>
      {items.map(i => (
        <div key={i} style={{ padding: '0.4rem 0.75rem', borderBottom: '1px solid #f0f0f0', fontSize: '0.9rem' }}>
          Item #{i + 1}
        </div>
      ))}
      {/* Sentinel: invisible div at the end — observer watches this */}
      <div ref={sentinelRef} style={{ height: 1 }} />
    </div>
  );
}

export function IntersectionObserverDemo() {
  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>IntersectionObserver</h3>

      <h4 style={{ fontSize: '0.95rem' }}>Reveal on scroll</h4>
      <p style={{ color: '#555', fontSize: '0.85rem' }}>Scroll down — cards animate in as they enter the viewport.</p>
      <div style={{ maxHeight: 180, overflowY: 'auto', padding: '0.5rem' }}>
        {Array.from({ length: 6 }, (_, i) => <RevealCard key={i} index={i} />)}
      </div>

      <h4 style={{ fontSize: '0.95rem', marginTop: '1rem' }}>Infinite scroll</h4>
      <p style={{ color: '#555', fontSize: '0.85rem' }}>Scroll to the bottom — more items load automatically.</p>
      <InfiniteScrollDemo />
    </div>
  );
}
