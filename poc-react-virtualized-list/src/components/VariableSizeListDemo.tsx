import { VariableSizeList, ListChildComponentProps } from 'react-window';
import { useRef } from 'react';

// VariableSizeList: each row can have a DIFFERENT height
// You provide an itemSize function: (index) => height
// react-window calls it to calculate scroll positions

// Simulate items with varying content length
const ITEMS = Array.from({ length: 10_000 }, (_, i) => ({
  id: i,
  text: `Item ${i + 1}: ${'word '.repeat(1 + (i % 5))}`,
  // height alternates: short items are 40px, taller ones are 80px
  height: i % 3 === 0 ? 80 : 40,
}));

// getItemSize is called by react-window to know the height of each row
const getItemSize = (index: number) => ITEMS[index].height;

function Row({ index, style }: ListChildComponentProps) {
  const item = ITEMS[index];
  return (
    <div
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        padding: '0 1rem',
        borderBottom: '1px solid #e2e8f0',
        background: item.height > 40 ? '#ebf8ff' : '#fff',
        fontSize: item.height > 40 ? '1rem' : '0.875rem',
      }}
    >
      {item.text}
    </div>
  );
}

export default function VariableSizeListDemo() {
  // listRef lets you call resetAfterIndex() if item heights change dynamically
  const listRef = useRef<VariableSizeList>(null);

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>react-window — VariableSizeList</h2>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        10,000 items with different heights — blue rows are taller
      </p>

      <VariableSizeList
        ref={listRef}
        height={400}
        itemCount={ITEMS.length}
        itemSize={getItemSize} // function instead of fixed number
        width="100%"
        estimatedItemSize={50} // hint for scroll bar accuracy before items are measured
      >
        {Row}
      </VariableSizeList>
    </div>
  );
}
