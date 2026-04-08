import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

// This component uses custom hooks — no direct useContext or context imports needed
export default function CustomHooksDemo() {
  const { user, login, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{
      padding: '1rem', border: '1px solid #cbd5e0', borderRadius: '8px',
      background: theme === 'dark' ? '#2d3748' : '#f7fafc',
      color: theme === 'dark' ? '#e2e8f0' : '#2d3748',
      marginTop: '1rem',
    }}>
      <h3>Custom Hooks Demo</h3>
      <p style={{ fontSize: '0.9rem' }}>
        Uses useAuth() and useTheme() — no direct context imports needed.
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button onClick={toggleTheme}>Toggle theme ({theme})</button>
        {user
          ? <button onClick={logout}>Logout ({user.name})</button>
          : <button onClick={() => login('Mateus')}>Login as Mateus</button>
        }
      </div>
    </div>
  );
}
