import { useMachine } from '@xstate/react';
import { signupMachine } from '../machines/signupMachine';

// useMachine returns the current `state` snapshot and a `send` function
// to dispatch events to the running machine.
// `state.matches(...)` checks the current state name — never check on
// implicit booleans, always ask the machine.

export function SignupWizard() {
  const [state, send] = useMachine(signupMachine);

  return (
    <section style={{ maxWidth: 480, padding: '1rem' }}>
      <h2>Signup wizard</h2>

      {/* Visual step indicator driven by state.matches(...) — UI is fully
          derived from the current state name, never duplicated as booleans */}
      <ol style={{ display: 'flex', gap: '0.5rem', padding: 0, listStyle: 'none', fontSize: '0.85rem' }}>
        <li style={{ fontWeight: state.matches('profile') ? 'bold' : undefined }}>1. Profile</li>
        <li style={{ fontWeight: state.matches('preferences') ? 'bold' : undefined }}>2. Preferences</li>
        <li style={{ fontWeight: state.matches('review') ? 'bold' : undefined }}>3. Review</li>
      </ol>

      {state.matches('profile') && (
        <div>
          <h3>Your profile</h3>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Name
            <input
              value={state.context.name}
              onChange={(e) =>
                send({ type: 'UPDATE_PROFILE', name: e.target.value, email: state.context.email })
              }
              style={{ display: 'block', width: '100%', padding: '0.4rem' }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Email
            <input
              value={state.context.email}
              onChange={(e) =>
                send({ type: 'UPDATE_PROFILE', name: state.context.name, email: e.target.value })
              }
              style={{ display: 'block', width: '100%', padding: '0.4rem' }}
            />
          </label>
          {/* Button stays disabled because the guard `isProfileValid` returns
              false until name + email are filled */}
          <button onClick={() => send({ type: 'NEXT' })}>Next →</button>
        </div>
      )}

      {state.matches('preferences') && (
        <div>
          <h3>Preferences</h3>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <input
              type="checkbox"
              checked={state.context.newsletter}
              onChange={(e) =>
                send({
                  type: 'UPDATE_PREFS',
                  newsletter: e.target.checked,
                  theme: state.context.theme,
                })
              }
            />{' '}
            Send me the newsletter
          </label>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Theme:{' '}
            <select
              value={state.context.theme}
              onChange={(e) =>
                send({
                  type: 'UPDATE_PREFS',
                  newsletter: state.context.newsletter,
                  theme: e.target.value as 'light' | 'dark',
                })
              }
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <button onClick={() => send({ type: 'BACK' })}>← Back</button>{' '}
          <button onClick={() => send({ type: 'NEXT' })}>Next →</button>
        </div>
      )}

      {state.matches('review') && (
        <div>
          <h3>Review</h3>
          <ul>
            <li>Name: {state.context.name}</li>
            <li>Email: {state.context.email}</li>
            <li>Newsletter: {state.context.newsletter ? 'Yes' : 'No'}</li>
            <li>Theme: {state.context.theme}</li>
          </ul>
          {state.context.errorMessage && (
            <p style={{ color: 'red' }}>Error: {state.context.errorMessage}</p>
          )}
          <button onClick={() => send({ type: 'BACK' })}>← Back</button>{' '}
          <button onClick={() => send({ type: 'SUBMIT' })}>Submit</button>
        </div>
      )}

      {state.matches('submitting') && (
        <p>
          ⏳ Submitting... (this state is a child of <code>submitting</code> and the
          machine is waiting for the invoked promise to resolve)
        </p>
      )}

      {state.matches('success') && (
        <div>
          <h3>✅ Account created!</h3>
          <p>
            The machine reached the <code>success</code> final state.
          </p>
          <button onClick={() => send({ type: 'RESET' })}>Start over</button>
        </div>
      )}

      {/* Debug box — shows the actual machine state */}
      <pre
        style={{
          marginTop: '2rem',
          padding: '0.75rem',
          background: '#f7fafc',
          fontSize: '0.8rem',
          borderRadius: '4px',
        }}
      >
        state.value: {JSON.stringify(state.value)}
      </pre>
    </section>
  );
}
