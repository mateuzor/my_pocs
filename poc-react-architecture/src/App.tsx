import { useState, useRef } from 'react';
import { usePrevious, useWindowSize } from './hooks';

function App() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  const { width, height } = useWindowSize();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Custom Hooks: usePrevious & useWindowSize</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>usePrevious Demo</h2>
        <button onClick={() => setCount(count + 1)}>Increment</button>
        <p>Current: {count}</p>
        <p>Previous: {prevCount ?? '-'}</p>
      </div>

      <div>
        <h2>useWindowSize Demo</h2>
        <p>Width: {width}px, Height: {height}px</p>
      </div>
    </div>
  );
}

export default App;
