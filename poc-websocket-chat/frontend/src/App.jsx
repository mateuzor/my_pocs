import { useState } from 'react';
import { useWebSocket } from './hooks/useWebSocket';

const STATUS_COLOR = {
  connecting: '#d69e2e',
  open: '#38a169',
  closed: '#718096',
  error: '#e53e3e',
};

export default function App() {
  const [input, setInput] = useState('');
  const { messages, status, retryCount, send, clearMessages } = useWebSocket('ws://localhost:4000');

  const handleSend = () => {
    if (input.trim()) {
      send(input);
      setInput('');
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h2>WebSocket Chat</h2>

      <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          width: 10, height: 10, borderRadius: '50%',
          background: STATUS_COLOR[status], display: 'inline-block',
        }} />
        <span style={{ fontSize: '0.85rem', color: '#555' }}>
          Status: {status}
          {retryCount > 0 && ` (reconnect attempt ${retryCount})`}
        </span>
        <button style={{ marginLeft: 'auto', fontSize: '0.8rem' }} onClick={clearMessages}>Clear</button>
      </div>

      <div style={{ marginBottom: 12 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          style={{ marginRight: 8, padding: '0.4rem' }}
        />
        <button onClick={handleSend} disabled={status !== 'open'}>Send</button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {messages.map(msg => (
          <li key={msg.id} style={{
            padding: '0.4rem 0.75rem', marginBottom: '0.25rem',
            background: msg.text.startsWith('[system]') ? '#fffbeb' : '#f7fafc',
            borderRadius: '6px', fontSize: '0.9rem',
          }}>
            {msg.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
