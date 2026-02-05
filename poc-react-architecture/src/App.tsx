import { useState } from 'react';
import { useDebounce, useToggle } from './hooks';

function App() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [isOn, toggle] = useToggle();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Custom Hooks: useDebounce & useToggle</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>useDebounce Demo</h2>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ padding: '8px', width: '300px' }} />
        <p>Immediate: {search}</p>
        <p>Debounced (500ms): {debouncedSearch}</p>
      </div>

      <div>
        <h2>useToggle Demo</h2>
        <button onClick={toggle} style={{ padding: '10px 20px' }}>
          {isOn ? 'ON' : 'OFF'}
        </button>
      </div>
    </div>
  );
}

export default App;
