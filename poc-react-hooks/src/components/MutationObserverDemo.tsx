import { useEffect, useRef, useState } from 'react';

// MutationObserver: fires when the DOM tree changes.
// Useful for detecting changes made by third-party scripts, attribute updates,
// or any DOM modification you did not trigger yourself.

function useMutationObserver(
  targetRef: React.RefObject<Element | null>,
  callback: MutationCallback,
  options: MutationObserverInit
) {
  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new MutationObserver(callback);
    observer.observe(target, options);
    // Always disconnect to prevent memory leaks
    return () => observer.disconnect();
  }, [targetRef, callback, options]);
}

// ResizeObserver: fires when an element's own dimensions change.
// Unlike window.resize, it watches individual elements — great for container-based layouts.
function useResizeObserver(targetRef: React.RefObject<Element | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width: Math.round(width), height: Math.round(height) });
    });

    observer.observe(target);
    return () => observer.disconnect();
  }, [targetRef]);

  return size;
}

export function MutationObserverDemo() {
  const listRef = useRef<HTMLUListElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [log, setLog] = useState<string[]>([]);
  const [items, setItems] = useState(['Item A', 'Item B', 'Item C']);
  const size = useResizeObserver(boxRef);

  const handleMutation: MutationCallback = (mutations) => {
    for (const m of mutations) {
      if (m.type === 'childList') {
        const added = m.addedNodes.length;
        const removed = m.removedNodes.length;
        if (added) setLog(p => [`+${added} node added`, ...p.slice(0, 3)]);
        if (removed) setLog(p => [`-${removed} node removed`, ...p.slice(0, 3)]);
      }
    }
  };

  useMutationObserver(listRef, handleMutation, { childList: true });

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>MutationObserver + ResizeObserver</h3>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <h4 style={{ fontSize: '0.9rem' }}>MutationObserver — child list changes</h4>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <button onClick={() => setItems(p => [...p, `Item ${String.fromCharCode(65 + p.length)}`])}>Add</button>
            <button onClick={() => setItems(p => p.slice(0, -1))} disabled={items.length === 0}>Remove</button>
          </div>
          <ul ref={listRef} style={{ margin: 0, padding: '0 0 0 1.25rem', fontSize: '0.85rem' }}>
            {items.map(i => <li key={i}>{i}</li>)}
          </ul>
          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#2b6cb0' }}>
            {log.map((l, i) => <div key={i}>{l}</div>)}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <h4 style={{ fontSize: '0.9rem' }}>ResizeObserver — drag to resize</h4>
          <div
            ref={boxRef}
            style={{
              resize: 'horizontal', overflow: 'auto',
              minWidth: 120, maxWidth: '100%',
              padding: '0.75rem',
              background: size.width < 200 ? '#fff5f5' : '#f0fff4',
              borderRadius: '8px', border: '2px dashed #cbd5e0',
              transition: 'background 0.2s', fontSize: '0.85rem',
            }}
          >
            {size.width}px × {size.height}px<br />
            {size.width < 200 ? 'Narrow' : 'Wide'} layout
          </div>
        </div>
      </div>
    </div>
  );
}
