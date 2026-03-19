import { useAppStore } from './useAppStore';

export function AppStoreDemo() {
  const { theme, toggleTheme, notifications, addNotification, removeNotification } = useAppStore();

  return (
    <div
      style={{
        padding: '1.5rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        marginBottom: '1rem',
        background: theme === 'dark' ? '#1a202c' : '#fff',
        color: theme === 'dark' ? '#e2e8f0' : '#1a202c',
        transition: 'all 0.2s',
      }}
    >
      <h3>Zustand — Slices + DevTools</h3>
      <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Open Redux DevTools extension to see action names and state changes.</p>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button onClick={toggleTheme}>Toggle Theme ({theme})</button>
        <button onClick={() => addNotification(`Notification at ${new Date().toLocaleTimeString()}`)}>
          Add Notification
        </button>
      </div>

      {notifications.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {notifications.map((n, i) => (
            <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem', background: theme === 'dark' ? '#2d3748' : '#f7fafc', marginBottom: '0.25rem', borderRadius: '4px' }}>
              {n}
              <button onClick={() => removeNotification(i)} style={{ fontSize: '0.8rem', marginLeft: '0.5rem' }}>✕</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
