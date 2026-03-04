import { useState, useMemo, memo } from 'react';

// ---- Child component WITHOUT memo ----
// Re-renders every time the parent renders, even if props haven't changed
function ExpensiveListRaw({ items }: { items: string[] }) {
  console.log('[ExpensiveListRaw] rendered');
  return (
    <ul>
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
}

// ---- Child component WITH memo ----
// React.memo wraps the component and does a shallow prop comparison
// If props are the same reference, React skips the re-render entirely
const ExpensiveList = memo(function ExpensiveList({ items }: { items: string[] }) {
  console.log('[ExpensiveList] rendered');
  return (
    <ul>
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
});

export function MemoDemo() {
  const [count, setCount] = useState(0);
  const [filter, setFilter] = useState('');

  // Raw array — new reference on every render, always triggers child re-render
  const itemsRaw = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

  // useMemo memoizes the result — only recomputes when `filter` changes
  // The array reference stays stable between unrelated renders (e.g., count change)
  const itemsMemo = useMemo(
    () => itemsRaw.filter(item => item.toLowerCase().includes(filter.toLowerCase())),
    [filter]
  );

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>React.memo + useMemo</h3>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>Open the console and click the counter — only the raw list re-renders.</p>

      {/* This state change triggers a parent re-render, which propagates to children */}
      <button onClick={() => setCount(c => c + 1)}>
        Counter: {count} (triggers parent re-render)
      </button>

      <div style={{ marginTop: '1rem' }}>
        <input
          placeholder="Filter fruits..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ padding: '0.4rem', marginBottom: '0.5rem', display: 'block' }}
        />
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div>
            <strong>Without memo</strong> (re-renders on every counter click)
            <ExpensiveListRaw items={itemsRaw} />
          </div>
          <div>
            <strong>With memo</strong> (only re-renders when filter changes)
            <ExpensiveList items={itemsMemo} />
          </div>
        </div>
      </div>
    </div>
  );
}
