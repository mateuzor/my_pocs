import { useEffect, useState } from 'react';

// Causes CLS: a banner is injected above existing content with no reserved
// space, pushing everything down. Fix: reserve height (min-height/aspect-ratio).
export function BadCls() {
  const [banner, setBanner] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setBanner(true), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <section>
      {banner && <div style={{ height: 160, background: 'tomato' }}>Late banner</div>}
      <h2>Layout shift</h2>
      <p>This text jumps down when the banner appears.</p>
      <p>Reload this tab to trigger it again.</p>
    </section>
  );
}
