'use client';
// 'use client' marks the boundary — everything in this file (and its imports)
// runs in the browser. useState and event handlers work here.
// Without this directive, Next.js assumes server-only and throws if you use hooks.

import { useState } from 'react';

interface Props {
  initialCount: number;
}

export default function ClientCounter({ initialCount }: Props) {
  const [count, setCount] = useState(initialCount);

  return (
    <div style={{ padding: '1rem', background: '#ebf8ff', borderRadius: '8px', marginTop: '1rem' }}>
      <p style={{ fontSize: '0.85rem', color: '#2b6cb0', marginBottom: '0.5rem' }}>
        Client Component — runs in the browser, can use state and events
      </p>
      <p>Count: <strong>{count}</strong></p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}
