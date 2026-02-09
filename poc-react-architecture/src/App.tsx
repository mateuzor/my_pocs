import { lazy, Suspense, useState } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  const [show, setShow] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Code Splitting: Basic Lazy Loading</h1>
      <button onClick={() => setShow(true)}>Load Component</button>
      
      {show && (
        <Suspense fallback={<div>Loading...</div>}>
          <HeavyComponent />
        </Suspense>
      )}
    </div>
  );
}

export default App;
