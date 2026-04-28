import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

// @tanstack/react-virtual is the TanStack alternative to react-window.
// Key difference: instead of wrapping your markup in a component,
// you get the virtualizer object and use it to compute positions yourself.
// More verbose, but gives total control over the markup.

const ALL_ITEMS = Array.from({ length: 50_000 }, (_, i) => ({
  id: i,
  label: `Row #${i + 1}`,
  value: Math.floor(Math.random() * 1000),
}));

export function VirtualList() {
  // The scrollable container — useVirtualizer needs a ref to it
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: ALL_ITEMS.length,       // total number of items
    getScrollElement: () => parentRef.current, // which element scrolls
    estimateSize: () => 40,        // estimated height of each item in px
    overscan: 5,                   // render 5 extra items above/below viewport
  });

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>TanStack Virtual — Large List</h2>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        50,000 rows — only visible items are in the DOM.
        TanStack Virtual gives you the positions; you build the markup.
      </p>

      {/* Scrollable container */}
      <div
        ref={parentRef}
        style={{ height: 400, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}
      >
        {/* Total height container — makes the scrollbar accurate */}
        <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
          {virtualizer.getVirtualItems().map(virtualRow => {
            const item = ALL_ITEMS[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                // data-index is used by the virtualizer to measure actual item height
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: 0,
                  // transform moves the item to its correct position
                  transform: `translateY(${virtualRow.start}px)`,
                  width: '100%',
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 1rem',
                  borderBottom: '1px solid #f0f0f0',
                  background: virtualRow.index % 2 === 0 ? '#fff' : '#f9fafb',
                  boxSizing: 'border-box',
                }}
              >
                <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
                <span style={{ color: '#718096', fontSize: '0.85rem' }}>{item.value}</span>
              </div>
            );
          })}
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: '#718096', marginTop: '0.5rem' }}>
        DOM nodes rendered: ~{virtualizer.getVirtualItems().length} out of {ALL_ITEMS.length.toLocaleString()}
      </p>
    </div>
  );
}
