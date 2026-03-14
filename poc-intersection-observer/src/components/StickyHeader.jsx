import { useState, useRef, useEffect } from 'react';

export function StickyHeader() {
  const [isSticky, setIsSticky] = useState(false);
  // Sentinel placed just above the header — when it scrolls out of view,
  // the header has become sticky
  const sentinelRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When sentinel leaves the viewport (isIntersecting = false), header is sticky
        // When it re-enters, header is back in normal flow
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>Sticky Header Detection</h3>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>Scroll inside the box — the header changes style when it sticks.</p>

      <div style={{ height: '250px', overflowY: 'auto', position: 'relative', border: '1px solid #eee', borderRadius: '6px' }}>
        {/* Sentinel: sits just above the header in the scroll flow */}
        <div ref={sentinelRef} style={{ height: '1px' }} />

        {/* Header: position sticky — sticks to the top of the scroll container */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            padding: '0.75rem 1rem',
            background: isSticky ? '#2d3748' : '#edf2f7',
            color: isSticky ? '#fff' : '#2d3748',
            fontWeight: 'bold',
            transition: 'all 0.2s ease',
            zIndex: 1,
          }}
        >
          {isSticky ? '📌 Sticky — scrolled past origin' : 'Normal — at origin'}
        </div>

        {/* Scrollable content below the header */}
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} style={{ padding: '0.5rem 1rem', borderBottom: '1px solid #eee' }}>
            Content row {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
