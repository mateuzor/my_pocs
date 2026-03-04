import { useState, useCallback, memo } from 'react';

// This child re-renders whenever its `onClick` prop changes reference
// Without useCallback, a new function is created every parent render → child always re-renders
const ActionButton = memo(function ActionButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  console.log(`[ActionButton "${label}"] rendered`);
  return (
    <button onClick={onClick} style={{ padding: '0.4rem 1rem', margin: '0.25rem' }}>
      {label}
    </button>
  );
});

export function CallbackDemo() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // WITHOUT useCallback: new function instance on every render
  // → ActionButton always re-renders even though the logic didn't change
  const handleIncrementRaw = () => setCount(c => c + 1);

  // WITH useCallback: same function reference across renders
  // → ActionButton only re-renders if the dependency array changes
  const handleIncrementMemo = useCallback(() => {
    setCount(c => c + 1);
  }, []); // empty deps — function never needs to change

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>useCallback</h3>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        Type in the input (triggers parent render) and watch the console.
      </p>

      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type to trigger re-renders..."
        style={{ padding: '0.4rem', display: 'block', marginBottom: '0.75rem' }}
      />

      <p>Count: <strong>{count}</strong></p>

      {/* Both buttons do the same thing, but only the second is stable across renders */}
      <ActionButton label="Increment (raw fn)" onClick={handleIncrementRaw} />
      <ActionButton label="Increment (useCallback)" onClick={handleIncrementMemo} />
    </div>
  );
}
