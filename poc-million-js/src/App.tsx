import { useMemo, useState } from 'react';
import { makeRows } from './data';
import { PlainRow } from './PlainRow';
import { BlockRow } from './BlockRow';
import { Measured, type Sample } from './Profiler';

type Mode = 'plain' | 'block';

export function App() {
  const [count, setCount] = useState(5000);
  const [tick, setTick] = useState(0);
  const [mode, setMode] = useState<Mode>('plain');
  const [samples, setSamples] = useState<Sample[]>([]);

  // Every tick changes every row's score, forcing a full list update:
  // the worst case for vDOM diffing and the best case for Million.
  const rows = useMemo(() => makeRows(count, tick), [count, tick]);
  const Row = mode === 'plain' ? PlainRow : BlockRow;

  const record = (s: Sample) => setSamples((prev) => [s, ...prev].slice(0, 8));

  return (
    <main style={{ fontFamily: 'sans-serif', padding: 16 }}>
      <h1>Million.js vs React</h1>
      <p>
        <label>
          Rows:{' '}
          <input
            type="number"
            value={count}
            step={1000}
            onChange={(e) => setCount(Number(e.target.value))}
          />
        </label>{' '}
        <button onClick={() => setMode(mode === 'plain' ? 'block' : 'plain')}>
          Mode: {mode}
        </button>{' '}
        <button onClick={() => setTick((t) => t + 1)}>Update all rows</button>
      </p>

      <h3>Last renders (actualDuration)</h3>
      <ul>
        {samples.map((s, i) => (
          <li key={i}>
            {s.label} / {s.phase}: {s.actualMs.toFixed(1)} ms
          </li>
        ))}
      </ul>

      {/* The label includes the mode so samples are comparable side by side. */}
      <Measured label={mode} onSample={record}>
        <table>
          <tbody>
            {rows.map((r) => (
              <Row key={r.id} row={r} />
            ))}
          </tbody>
        </table>
      </Measured>
    </main>
  );
}
