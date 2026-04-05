import { FixedSizeList, ListChildComponentProps } from 'react-window';

// react-window renders only the visible rows — not all 50000 items
// FixedSizeList: all rows have the SAME height (most performant case)
// - height: total visible area height
// - itemCount: total number of items in the list
// - itemSize: height of each row in pixels

const ALL_ITEMS = Array.from({ length: 50_000 }, (_, i) => ({
  id: i,
  name: `User #${i + 1}`,
  score: Math.floor(Math.random() * 100),
}));

// Row is called only for visible items — react-window handles the math
// style must be applied to the row element to position it correctly
function Row({ index, style }: ListChildComponentProps) {
  const item = ALL_ITEMS[index];
  return (
    <div
      style={{
        ...style, // top + height are injected by react-window
        display: 'flex',
        alignItems: 'center',
        padding: '0 1rem',
        borderBottom: '1px solid #eee',
        background: index % 2 === 0 ? '#fff' : '#f9fafb',
      }}
    >
      <span style={{ flex: 1 }}>{item.name}</span>
      <span style={{ color: '#718096' }}>Score: {item.score}</span>
    </div>
  );
}

export default function FixedSizeListDemo() {
  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>react-window — FixedSizeList</h2>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        50,000 items — only ~15 DOM nodes exist at a time
      </p>

      <FixedSizeList
        height={400}       // visible area height in px
        itemCount={ALL_ITEMS.length}
        itemSize={40}      // each row is exactly 40px tall
        width="100%"
      >
        {Row}
      </FixedSizeList>
    </div>
  );
}
