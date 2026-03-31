import { useMachine } from '@xstate/react';
import { useState } from 'react';
import { authMachine } from './authMachine';

export function AuthMachine() {
  const [state, send] = useMachine(authMachine);
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    send({ type: 'LOGIN' });
    // Simulate async — check password then send result
    setTimeout(() => {
      if (password === 'secret') {
        send({ type: 'SUCCESS', username: 'mateus@dev.com' });
      } else {
        send({ type: 'FAILURE' });
      }
    }, 500);
    setPassword('');
  };

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>XState — Guards & Context</h3>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        Guards block transitions conditionally. Context stores data inside the machine.
        Hint: password is "secret". Wrong 3 times = locked.
      </p>

      <p>State: <strong>{state.value as string}</strong> | Attempts: <strong>{state.context.attempts}</strong></p>

      {state.matches('idle') && (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter password..."
            style={{ padding: '0.4rem', flex: 1 }}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      )}

      {state.matches('loading') && <p style={{ color: '#888' }}>Checking credentials...</p>}

      {state.matches('authenticated') && (
        <div>
          <p style={{ color: '#38a169' }}>✓ Logged in as {state.context.user}</p>
          <button onClick={() => send({ type: 'LOGOUT' })}>Logout</button>
        </div>
      )}

      {state.matches('locked') && (
        <div>
          <p style={{ color: '#e53e3e' }}>🔒 Account locked after too many attempts.</p>
          <button onClick={() => send({ type: 'RESET' })}>Reset</button>
        </div>
      )}

      {state.context.errorMessage && (
        <p style={{ color: '#e53e3e', fontSize: '0.9rem', marginTop: '0.5rem' }}>{state.context.errorMessage}</p>
      )}
    </div>
  );
}
