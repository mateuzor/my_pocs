import { ErrorBoundary } from 'react-error-boundary';
import { useState } from 'react';

// react-error-boundary is a library that wraps the class-based pattern into a reusable component.
// fallbackRender receives { error, resetErrorBoundary } — no class needed.

function Bomb() {
  const [explode, setExplode] = useState(false);
  if (explode) throw new Error('Component crashed!');
  return <button onClick={() => setExplode(true)}>Trigger crash</button>;
}

function Fallback({ error, resetErrorBoundary }) {
  return (
    <div style={{ background: '#fff5f5', padding: '1rem', borderRadius: '8px', border: '1px solid #fc8181' }}>
      <strong>Caught:</strong> {error.message}
      {/* resetErrorBoundary clears the error and re-renders the children */}
      <button style={{ marginLeft: '1rem' }} onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

export default function FallbackRenderDemo() {
  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginTop: '1rem' }}>
      <h3>react-error-boundary — fallbackRender</h3>
      <ErrorBoundary fallbackRender={Fallback}>
        <Bomb />
      </ErrorBoundary>
    </div>
  );
}
