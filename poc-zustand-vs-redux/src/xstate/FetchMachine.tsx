import { useMachine } from '@xstate/react';
import { fetchMachine } from './fetchMachine';

export function FetchMachine() {
  const [state, send] = useMachine(fetchMachine);

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>XState — invoke (async states)</h3>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        invoke runs a Promise inside a state. onDone/onError replace manual try/catch.
      </p>

      <p>State: <strong>{state.value as string}</strong></p>

      {state.matches('idle') && (
        <button onClick={() => send({ type: 'FETCH' })} style={{ padding: '0.4rem 1rem' }}>
          Fetch Posts
        </button>
      )}

      {state.matches('loading') && <p style={{ color: '#888' }}>Loading...</p>}

      {state.matches('failure') && (
        <div>
          <p style={{ color: '#e53e3e' }}>Error: {state.context.error}</p>
          <button onClick={() => send({ type: 'RETRY' })}>Retry</button>
        </div>
      )}

      {state.matches('success') && (
        <div>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.5rem' }}>
            {state.context.posts.map(post => (
              <li key={post.id} style={{ padding: '0.4rem 0', borderBottom: '1px solid #eee', fontSize: '0.9rem' }}>
                {post.title}
              </li>
            ))}
          </ul>
          <button onClick={() => send({ type: 'FETCH' })} style={{ marginTop: '0.5rem', padding: '0.4rem 1rem' }}>
            Refetch
          </button>
        </div>
      )}
    </div>
  );
}
