import ErrorBoundary from './ErrorBoundary';
import BuggyComponent from './BuggyComponent';

function App() {
  const customFallback = (
    <div style={{ padding: '20px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
      <h3>🚨 Component Failed</h3>
      <p>Check console for error logs</p>
    </div>
  );

  return (
    <div style={{ padding: '20px' }}>
      <h1>Error Boundaries: Custom Fallback & Logging</h1>
      
      <ErrorBoundary 
        fallback={customFallback}
        onError={(err) => console.log('Logged:', err.message)}
      >
        <BuggyComponent />
      </ErrorBoundary>
    </div>
  );
}

export default App;
