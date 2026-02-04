import MouseTracker from './MouseTracker';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Render Props Pattern: Mouse Tracker</h1>
      <p>Move your mouse inside the box</p>
      
      <MouseTracker render={({ x, y }) => (
        <div>
          <h3>Mouse Position:</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
            X: {x}px, Y: {y}px
          </p>
        </div>
      )} />
    </div>
  );
}

export default App;
