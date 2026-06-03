import { useState } from 'react';

// STRATEGY 1 — raw dynamic import() of a non-component module.
// `import('...')` returns a Promise and tells the bundler to split that module
// into its OWN chunk. The chunk is fetched only when this code runs (button
// click), so it never bloats the initial bundle. Use this for heavy *logic*
// (a parser, a date lib) that isn't a React component.
export function ManualImport() {
  const [out, setOut] = useState('');

  const run = async () => {
    // Network tab: a separate formatter-*.js chunk loads exactly here.
    const { format } = await import('./heavy/formatter');
    setOut(format('loaded on demand'));
  };

  return (
    <section>
      <h2>1. Manual import()</h2>
      <button onClick={run}>format something</button>
      {out && <p>{out}</p>}
    </section>
  );
}
