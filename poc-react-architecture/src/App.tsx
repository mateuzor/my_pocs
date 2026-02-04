import Toggle from './Toggle';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Render Props: Toggle</h1>
      
      <Toggle>
        {(isOn, toggle) => (
          <div>
            <button onClick={toggle} style={{ padding: '10px 20px', backgroundColor: isOn ? '#10b981' : '#6b7280', color: 'white', border: 'none', borderRadius: '6px' }}>
              {isOn ? 'ON ✅' : 'OFF ❌'}
            </button>
            {isOn && <p style={{ marginTop: '10px', color: '#10b981' }}>Toggle is active!</p>}
          </div>
        )}
      </Toggle>
    </div>
  );
}

export default App;
