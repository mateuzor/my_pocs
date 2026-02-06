import { useState } from 'react';
import ErrorBoundary from './ErrorBoundary';
import BuggyComponent from './BuggyComponent';

function Counter() {
  const [count, setCount] = useState(0);
  if (count >= 3) throw new Error('Count too high!');
  return <div><p>Count: {count}</p><button onClick={() => setCount(count + 1)}>+</button></div>;
}

function App() {
  const [key, setKey] = useState(0);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Error Boundaries: Isolated & Reset</h1>
      
      <h2>Isolated Boundaries</h2>
      <ErrorBoundary><div style={{ padding: '10px', backgroundColor: '#d1fae5' }}>✅ Widget A</div></ErrorBoundary>
      <ErrorBoundary><BuggyComponent /></ErrorBoundary>
      <ErrorBoundary><div style={{ padding: '10px', backgroundColor: '#d1fae5' }}>✅ Widget C</div></ErrorBoundary>
      
      <h2 style={{ marginTop: '20px' }}>Reset Pattern</h2>
      <button onClick={() => setKey(k => k + 1)}>Reset Component</button>
      <ErrorBoundary key={key}><Counter /></ErrorBoundary>
    </div>
  );
}

export default App;
