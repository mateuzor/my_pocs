import { useContext } from 'react';
import "./App.css";
import Counter from "./components/Counter";
import LayoutEffectExample from "./components/LayoutEffectExample";
import NameInput from "./components/NameInput";
import { ThemeContext, ThemeProvider } from './contexts/ThemeContext';

function ThemeDisplay() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('ThemeDisplay must be used within ThemeProvider');
  }

  const { theme, toggleTheme } = context;

  return (
    <div style={{
      padding: '40px',
      backgroundColor: theme === 'light' ? '#ffffff' : '#1a1a1a',
      color: theme === 'light' ? '#000000' : '#ffffff',
      minHeight: '100vh',
      transition: 'all 0.3s ease'
    }}>
      <h1>useContext - Theme Example</h1>
      <p>Current theme: <strong>{theme}</strong></p>

      <button
        onClick={toggleTheme}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: theme === 'light' ? '#333' : '#fff',
          color: theme === 'light' ? '#fff' : '#333',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        Toggle to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>

      <div style={{ marginTop: '30px' }}>
        <h2>How useContext works:</h2>
        <ul style={{ textAlign: 'left', maxWidth: '600px' }}>
          <li>Creates shared state accessible anywhere in component tree</li>
          <li>No need to pass props through every level (prop drilling)</li>
          <li>Provider wraps components that need the context</li>
          <li>useContext hook accesses the context value</li>
        </ul>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ThemeDisplay />
      {/* Previous examples */}
      {/* <NameInput />
      <Counter />
      <LayoutEffectExample /> */}
    </ThemeProvider>
  );
}

export default App;
