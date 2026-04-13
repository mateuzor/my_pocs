import { useState, useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';

const ITEMS = Array.from({ length: 100 }, (_, i) => `Product #${i + 1}`);

export default function SearchWithDebounce() {
  const [query, setQuery] = useState('');
  const [callCount, setCallCount] = useState(0);

  // debouncedQuery only updates 400ms after typing stops
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (debouncedQuery) setCallCount(c => c + 1);
  }, [debouncedQuery]);

  const results = ITEMS.filter(i => i.toLowerCase().includes(debouncedQuery.toLowerCase()));

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2>useDebounce — Search</h2>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search products..."
        style={{ padding: '0.4rem', width: 260 }}
      />
      <p style={{ fontSize: '0.85rem', color: '#555' }}>
        Filter ran {callCount}x — showing {results.length} results for "{debouncedQuery}"
      </p>
    </div>
  );
}
