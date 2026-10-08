import { useEffect, useState } from 'react';

// Causes slow LCP: the biggest element only appears after a delay,
// as happens with client-fetched hero content or lazy images.
export function BadLcp() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <section>
      <h2>Slow LCP</h2>
      {ready && (
        <div style={{ height: 400, background: 'linear-gradient(#69f, #fc6)', fontSize: 32 }}>
          Hero rendered after 3s
        </div>
      )}
    </section>
  );
}
