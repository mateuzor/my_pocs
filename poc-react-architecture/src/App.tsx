import { lazy, Suspense, useState } from 'react';

const Gallery = lazy(() => import('./Gallery'));
const Heavy = lazy(() => import('./HeavyComponent'));

function App() {
  const [route, setRoute] = useState<'home' | 'gallery' | 'heavy'>('home');

  return (
    <div style={{ padding: '20px' }}>
      <h1>Code Splitting: Route-based</h1>
      <nav style={{ marginBottom: '20px' }}>
        <button onClick={() => setRoute('home')}>Home</button>
        <button onClick={() => setRoute('gallery')}>Gallery</button>
        <button onClick={() => setRoute('heavy')}>Heavy</button>
      </nav>
      
      <Suspense fallback={<div>Loading...</div>}>
        {route === 'home' && <div>Home Page</div>}
        {route === 'gallery' && <Gallery />}
        {route === 'heavy' && <Heavy />}
      </Suspense>
    </div>
  );
}

export default App;
