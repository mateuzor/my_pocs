import React, { Suspense, lazy } from "react";
import { RemoteErrorBoundary } from "./RemoteErrorBoundary";

const Button = lazy(() => import("remote/Button"));
const Card = lazy(() => import("remote/Card"));

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
      <p style={{ color: '#555' }}>
        Remote components with error boundaries — stop the remote server to see the fallback:
      </p>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap', marginTop: '1rem' }}>
        {/* ErrorBoundary wraps Suspense — catches both load failures and render errors */}
        <RemoteErrorBoundary componentName="Button" fallbackMessage="Remote app may be offline.">
          <Suspense fallback={<LoadingFallback name="Button" />}>
            <Button />
          </Suspense>
        </RemoteErrorBoundary>

        <RemoteErrorBoundary componentName="Card" fallbackMessage="Remote app may be offline.">
          <Suspense fallback={<LoadingFallback name="Card" />}>
            <Card
              title="Remote Card"
              description="Stop the remote server to see the error boundary in action."
              color="#7928ca"
            />
          </Suspense>
        </RemoteErrorBoundary>
      </div>
    </div>
  );
}
