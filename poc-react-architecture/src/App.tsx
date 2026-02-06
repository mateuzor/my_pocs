import ErrorBoundary from './ErrorBoundary';
import BuggyComponent from './BuggyComponent';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Error Boundaries: Basic Implementation</h1>
      <p>Error boundary catches the crash</p>
      
      <ErrorBoundary>
        <BuggyComponent />
      </ErrorBoundary>
    </div>
  );
}

export default App;
