import { lazy, Suspense, useState } from 'react';
import ErrorBoundary from './ErrorBoundary';

const Heavy = lazy(() => import('./HeavyComponent'));
const preload = () => import('./HeavyComponent');

function App() {
  const [show, setShow] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Code Splitting: Preloading & Error Handling</h1>
      <button onMouseEnter={preload} onClick={() => setShow(true)}>
        Hover to preload, click to show
      </button>
      
      {show && (
        <ErrorBoundary fallback={<div>Failed to load</div>}>
          <Suspense fallback={<div>Loading...</div>}>
            <Heavy />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
}

export default App;
