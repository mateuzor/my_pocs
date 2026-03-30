import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { recoilCountAtom, recoilNameAtom, persistedCountAtom } from './atoms';

export function RecoilAtoms() {
  // useRecoilState — same API as useState, but backed by a global atom
  const [count, setCount] = useRecoilState(recoilCountAtom);
  const [name, setName] = useRecoilState(recoilNameAtom);

  // useRecoilValue — read-only, component re-renders when value changes
  const persisted = useRecoilValue(persistedCountAtom);

  // useSetRecoilState — write-only, component never re-renders from this atom
  const setPersistedCount = useSetRecoilState(persistedCountAtom);

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>Recoil — atoms</h3>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        Same API as Jotai, but atoms require a unique string key. Requires RecoilRoot wrapper.
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.75rem' }}>
        <button onClick={() => setCount(c => c - 1)}>−</button>
        <strong>{count}</strong>
        <button onClick={() => setCount(c => c + 1)}>+</button>
      </div>

      <div style={{ marginTop: '0.75rem' }}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name..."
          style={{ padding: '0.4rem' }}
        />
        <p style={{ fontSize: '0.9rem', color: '#555', marginTop: '0.25rem' }}>Hello, {name}!</p>
      </div>

      <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#f7fafc', borderRadius: '6px' }}>
        <p style={{ fontSize: '0.85rem', margin: 0 }}>
          Persisted count (survives refresh): <strong>{persisted}</strong>
        </p>
        <button
          onClick={() => setPersistedCount(c => c + 1)}
          style={{ marginTop: '0.4rem', padding: '0.3rem 0.75rem', fontSize: '0.85rem' }}
        >
          Increment persisted
        </button>
      </div>
    </div>
  );
}
