import { useMemo, useState } from 'react';
// Named imports from lodash-es: ESM lets bundlers tree-shake unused functions.
// The final bundle size shows how well each tool does it (lodash vs lodash-es is a classic trap).
import { groupBy, debounce } from 'lodash-es';
import { items } from './data';

export function App() {
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');

  // Created once so the debounce timer survives re-renders.
  const update = useMemo(() => debounce(setDebounced, 200), []);

  const filtered = items.filter((i) => i.name.includes(debounced));
  const grouped = groupBy(filtered, 'group');

  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <h1>Same app, three bundlers</h1>
      <input
        value={query}
        placeholder="filter items..."
        onChange={(e) => {
          setQuery(e.target.value);
          update(e.target.value);
        }}
      />
      {Object.entries(grouped).map(([group, list]) => (
        <section key={group}>
          <h2>
            {group} ({list.length})
          </h2>
        </section>
      ))}
    </main>
  );
}
