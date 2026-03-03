import React, { Suspense, lazy } from "react";

// React.lazy defers loading the remote bundle until the component is actually rendered
// Without lazy: the remote chunk is fetched on initial page load
// With lazy: the fetch only happens when the component enters the render tree
const Button = lazy(() => import("remote/Button"));
const Card = lazy(() => import("remote/Card"));

// Fallback shown while the remote chunk is being downloaded
function LoadingFallback({ name }) {
  return (
    <div style={{ padding: '1rem', color: '#888', fontStyle: 'italic' }}>
      Loading {name}...
    </div>
  );
}

export default function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>Host App</h1>
      <p style={{ color: '#555' }}>Remote components are lazy-loaded on demand:</p>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap', marginTop: '1rem' }}>
        {/* Each Suspense boundary is independent — one loading state per remote chunk */}
        <Suspense fallback={<LoadingFallback name="Button" />}>
          <Button />
        </Suspense>

        <Suspense fallback={<LoadingFallback name="Card" />}>
          <Card
            title="Remote Card"
            description="Loaded lazily — check the Network tab to see the separate chunk."
            color="#7928ca"
          />
        </Suspense>
      </div>
    </div>
  );
}
