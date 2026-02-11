import { useContext, useState } from 'react';
import "./App.css";
import Counter from "./components/Counter";
import LayoutEffectExample from "./components/LayoutEffectExample";
import NameInput from "./components/NameInput";
import { ThemeContext, ThemeProvider } from './contexts/ThemeContext';
import { AuthContext, AuthProvider } from './contexts/AuthContext';

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

function AuthDemo() {
  const context = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!context) {
    throw new Error('AuthDemo must be used within AuthProvider');
  }

  const { user, login, logout, isAuthenticated } = context;

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>useContext - Auth Example</h1>

      {!isAuthenticated ? (
        <div>
          <h2>Login Form</h2>
          <div style={{ marginBottom: '15px' }}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              style={{ marginLeft: '10px', padding: '8px', width: '200px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="demo123"
              style={{ marginLeft: '10px', padding: '8px', width: '200px' }}
            />
          </div>
          <button
            onClick={() => login(email, password)}
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            Login
          </button>
          <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
            Hint: Use password "demo123"
          </p>
        </div>
      ) : (
        <div>
          <h2>Welcome, {user?.name}!</h2>
          <div style={{
            backgroundColor: '#f0f0f0',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <p><strong>User Info:</strong></p>
            <p>ID: {user?.id}</p>
            <p>Name: {user?.name}</p>
            <p>Email: {user?.email}</p>
          </div>
          <button
            onClick={logout}
            style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Logout
          </button>
        </div>
      )}

      <div style={{ marginTop: '40px', textAlign: 'left' }}>
        <h3>Multiple Contexts Pattern:</h3>
        <ul>
          <li>Can nest multiple Context Providers</li>
          <li>Each context manages different concerns (theme, auth, etc)</li>
          <li>Components can use multiple contexts via multiple useContext calls</li>
          <li>Prevents prop drilling for cross-cutting concerns</li>
        </ul>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AuthDemo />
      {/* Previous examples */}
      {/* <ThemeProvider><ThemeDisplay /></ThemeProvider> */}
      {/* <NameInput />
      <Counter />
      <LayoutEffectExample /> */}
    </AuthProvider>
  );
}

export default App;
