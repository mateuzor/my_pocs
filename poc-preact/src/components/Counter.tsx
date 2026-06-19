import { useState, useEffect, useMemo } from "preact/hooks";

// HOOKS — Preact ships the same hooks API as React, but from "preact/hooks".
// The mental model is identical: useState triggers a re-render of THIS
// component, useEffect runs after paint, useMemo caches a computation.
// The point of this demo: the whole component re-runs top-to-bottom on each
// state change (classic VDOM diffing) — contrast this with signals later.
export function Counter() {
  const [count, setCount] = useState(0);

  // Derived value recomputed only when `count` changes.
  const parity = useMemo(() => (count % 2 === 0 ? "even" : "odd"), [count]);

  // Side effect: keep the document title in sync with state.
  useEffect(() => {
    document.title = `Count: ${count}`;
    return () => {
      document.title = "Preact POC";
    };
  }, [count]);

  return (
    <section>
      <h2>Hooks counter</h2>
      <p>
        {count} <small>({parity})</small>
      </p>
      <button onClick={() => setCount((c) => c + 1)}>increment</button>
      <button onClick={() => setCount(0)}>reset</button>
    </section>
  );
}
