import React, { Suspense, useState } from "react";

// Lazily load the heavy component.
// React.lazy dynamically imports the module only when it's rendered.
const LazyComponent = React.lazy(() => import("./HeavyComponent"));

export default function App() {
  const [show, setShow] = useState(false);

  // Preload function: manually starts downloading the component
  // Useful for anticipating user interaction (e.g. hover)
  const preload = () => {
    import("./HeavyComponent");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>React Suspense Preloading Demo</h1>

      <button
        onMouseEnter={preload} // starts preloading on hover
        onClick={() => setShow(true)} // triggers rendering on click
        style={{ marginBottom: 20 }}
      >
        Load Heavy Component
      </button>

      {/* Suspense handles fallback while the component is loading */}
      {show && (
        <Suspense fallback={<div>Loading heavy component...</div>}>
          <LazyComponent />
        </Suspense>
      )}
    </div>
  );
}
