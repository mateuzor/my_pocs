import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { countAtom, nameAtom, greetingAtom, doubledCountAtom } from './atoms';

export function JotaiBasic() {
  // useAtom: [value, setter] — like useState but backed by a global atom
  const [count, setCount] = useAtom(countAtom);
  const [name, setName] = useAtom(nameAtom);

  // useAtomValue: read-only — component only re-renders when this atom changes
  const greeting = useAtomValue(greetingAtom);

  // useSetAtom: write-only — this component never re-renders from this atom's value
  const setDoubled = useSetAtom(doubledCountAtom);

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>Jotai — Atoms</h3>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        Atoms are global, composable state units. No Provider needed by default.
      </p>

      <p style={{ background: '#ebf8ff', padding: '0.5rem', borderRadius: '4px', fontSize: '0.9rem' }}>
        {greeting}
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.75rem' }}>
        <button onClick={() => setCount(c => c - 1)}>−</button>
        <strong>{count}</strong>
        <button onClick={() => setCount(c => c + 1)}>+</button>
        <button onClick={() => setDoubled(count * 2 + 2)}>+2 via derived setter</button>
      </div>

      <div style={{ marginTop: '0.75rem' }}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name..."
          style={{ padding: '0.4rem' }}
        />
      </div>
    </div>
  );
}
