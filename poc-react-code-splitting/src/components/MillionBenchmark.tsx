import { useState, useTransition } from 'react';
import { block } from 'million/react';

// Benchmark: compare re-render time of a plain React list vs a Million.js block list.
// Both render the same 500-item list but use different diffing strategies.

interface Item { id: number; value: number; }

const generateItems = (): Item[] =>
  Array.from({ length: 500 }, (_, i) => ({ id: i, value: Math.floor(Math.random() * 1000) }));

// Plain React row — goes through React's full reconciler on every render
function ReactRowBase({ id, value }: Item) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 8px', fontSize: '0.8rem' }}>
      <span>#{id}</span><span>{value}</span>
    </div>
  );
}

// Million row — bypasses React reconciler, uses fine-grained DOM patching
const MillionRow = block(function MillionRowBase({ id, value }: Item) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 8px', fontSize: '0.8rem' }}>
      <span>#{id}</span><span>{value}</span>
    </div>
  );
});

export default function MillionBenchmark() {
  const [items, setItems] = useState<Item[]>(generateItems);
  const [reactTime, setReactTime] = useState<number | null>(null);
  const [millionTime, setMillionTime] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  const runBenchmark = () => {
    const start = performance.now();
    // Force a full re-render by generating new items
    startTransition(() => {
      setItems(generateItems());
      setReactTime(performance.now() - start);
    });
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>Million.js Benchmark</h2>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        500-item list re-rendered on each click. Million.js skips React's vDOM diff.
      </p>

      <button onClick={runBenchmark} style={{ marginBottom: '1rem', padding: '0.4rem 1rem' }}>
        Shuffle & measure
      </button>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '0.9rem' }}>Plain React</h4>
          {reactTime !== null && (
            <p style={{ fontSize: '0.85rem', color: '#c53030' }}>{reactTime.toFixed(1)}ms</p>
          )}
          <div style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
            {items.slice(0, 50).map(item => <ReactRowBase key={item.id} {...item} />)}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '0.9rem' }}>Million.js block()</h4>
          {millionTime !== null && (
            <p style={{ fontSize: '0.85rem', color: '#276749' }}>{millionTime.toFixed(1)}ms</p>
          )}
          <div style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
            {items.slice(0, 50).map(item => <MillionRow key={item.id} {...item} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
