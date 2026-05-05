import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

// TanStack Virtual supports 2D grids by running two virtualizers on the same container:
// one for rows (vertical scroll) and one for columns (horizontal scroll).
// Each cell is positioned with translateY (row) + translateX (column).

const ROW_COUNT = 500;
const COL_COUNT = 20;
const ROW_HEIGHT = 35;
const COL_WIDTH = 100;

export function VirtualGrid() {
  const parentRef = useRef<HTMLDivElement>(null);

  // Vertical virtualizer — controls which rows are rendered
  const rowVirtualizer = useVirtualizer({
    count: ROW_COUNT,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5,
  });

  // Horizontal virtualizer — controls which columns are rendered
  const colVirtualizer = useVirtualizer({
    count: COL_COUNT,
    getScrollElement: () => parentRef.current,
    estimateSize: () => COL_WIDTH,
    horizontal: true, // scroll axis
    overscan: 3,
  });

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>TanStack Virtual — 2D Grid</h2>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        {ROW_COUNT} rows × {COL_COUNT} columns = {(ROW_COUNT * COL_COUNT).toLocaleString()} cells.
        Both axes are virtualized — only visible cells exist in the DOM.
      </p>

      {/* Single scrollable container handles both axes */}
      <div
        ref={parentRef}
        style={{
          height: 400,
          overflowY: 'auto',
          overflowX: 'auto',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
        }}
      >
        {/* Inner div sized to the total virtual dimensions */}
        <div style={{
          height: rowVirtualizer.getTotalSize(),
          width: colVirtualizer.getTotalSize(),
          position: 'relative',
        }}>
          {rowVirtualizer.getVirtualItems().map(virtualRow =>
            colVirtualizer.getVirtualItems().map(virtualCol => (
              <div
                key={`${virtualRow.key}-${virtualCol.key}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: virtualCol.size,
                  height: virtualRow.size,
                  // Both offsets applied via transform for GPU-accelerated positioning
                  transform: `translateY(${virtualRow.start}px) translateX(${virtualCol.start}px)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #f0f0f0',
                  fontSize: '0.75rem',
                  background: virtualRow.index % 2 === 0 ? '#fff' : '#f9fafb',
                  boxSizing: 'border-box',
                }}
              >
                {virtualRow.index},{virtualCol.index}
              </div>
            ))
          )}
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: '#718096', marginTop: '0.5rem' }}>
        ~{rowVirtualizer.getVirtualItems().length * colVirtualizer.getVirtualItems().length} cells
        in DOM out of {(ROW_COUNT * COL_COUNT).toLocaleString()}
      </p>
    </div>
  );
}
