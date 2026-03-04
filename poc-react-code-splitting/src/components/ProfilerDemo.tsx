import { Profiler, ProfilerOnRenderCallback, useState } from 'react';

interface RenderLog {
  id: string;
  phase: 'mount' | 'update' | 'nested-update';
  actualDuration: number;
  baseDuration: number;
  timestamp: number;
}

// onRender callback — called by React after every committed render inside the Profiler
// This is how you measure real render performance programmatically
const onRender: ProfilerOnRenderCallback = (
  id,           // the "id" prop of the Profiler tree
  phase,        // "mount", "update", or "nested-update"
  actualDuration, // time spent rendering the committed update (ms)
  baseDuration,   // estimated time to render without memoization (ms)
) => {
  // In production: send these numbers to an analytics service
  console.log(`[Profiler] ${id} — ${phase} — actual: ${actualDuration.toFixed(2)}ms`);
};

// A deliberately "slow" component to make profiling visible
function SlowComponent({ items }: { items: number[] }) {
  // Simulate expensive computation — intentionally not memoized
  const sum = items.reduce((acc, n) => {
    let result = 0;
    for (let i = 0; i < 1000; i++) result += n * i; // fake work
    return acc + result;
  }, 0);

  return (
    <div style={{ padding: '0.75rem', background: '#f9f9f9', borderRadius: '4px' }}>
      <p>Items: {items.length} | Computed sum: {sum.toLocaleString()}</p>
    </div>
  );
}

export function ProfilerDemo() {
  const [logs, setLogs] = useState<RenderLog[]>([]);
  const [items, setItems] = useState<number[]>([1, 2, 3]);

  // Augmented onRender that also updates the UI log
  const handleRender: ProfilerOnRenderCallback = (id, phase, actualDuration, baseDuration) => {
    onRender(id, phase, actualDuration, baseDuration, 0, 0);
    setLogs(prev => [
      { id, phase, actualDuration, baseDuration, timestamp: Date.now() },
      ...prev.slice(0, 4), // keep last 5 entries
    ]);
  };

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>React Profiler API</h3>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        Click the button to trigger a re-render and see the measured durations below.
      </p>

      {/* Profiler wraps the subtree you want to measure */}
      <Profiler id="SlowComponent" onRender={handleRender}>
        <SlowComponent items={items} />
      </Profiler>

      <button
        onClick={() => setItems(prev => [...prev, prev.length + 1])}
        style={{ marginTop: '0.75rem', padding: '0.4rem 1rem' }}
      >
        Add item (trigger re-render)
      </button>

      {/* Render log table */}
      {logs.length > 0 && (
        <table style={{ marginTop: '1rem', width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={{ padding: '0.4rem', textAlign: 'left' }}>Phase</th>
              <th style={{ padding: '0.4rem', textAlign: 'right' }}>Actual (ms)</th>
              <th style={{ padding: '0.4rem', textAlign: 'right' }}>Base (ms)</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} style={{ borderTop: '1px solid #eee' }}>
                <td style={{ padding: '0.4rem' }}>{log.phase}</td>
                <td style={{ padding: '0.4rem', textAlign: 'right' }}>{log.actualDuration.toFixed(2)}</td>
                <td style={{ padding: '0.4rem', textAlign: 'right' }}>{log.baseDuration.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
