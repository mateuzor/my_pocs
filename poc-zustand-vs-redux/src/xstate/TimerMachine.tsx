import { useMachine } from '@xstate/react';
import { useEffect, useState } from 'react';
import { timerMachine } from './timerMachine';

export function TimerMachine() {
  const [state, send] = useMachine(timerMachine);
  const [display, setDisplay] = useState(0);

  // Visual countdown — just for display, independent of the machine
  useEffect(() => {
    if (!state.matches('running')) { setDisplay(0); return; }
    setDisplay(state.context.duration);
    const interval = setInterval(() => setDisplay(d => Math.max(0, d - 1)), 1000);
    return () => clearInterval(interval);
  }, [state.value, state.context.duration]);

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>XState — Delayed Transitions (after)</h3>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        after() schedules automatic transitions. No manual setTimeout — XState manages the timer.
      </p>

      <p>State: <strong>{state.value as string}</strong></p>

      {state.matches('running') && (
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{display}s remaining</p>
      )}
      {state.matches('done') && (
        <p style={{ color: '#38a169', fontWeight: 'bold' }}>✓ Timer completed!</p>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        {state.matches('idle') && (
          <>
            <label style={{ fontSize: '0.9rem' }}>
              Duration (s):
              <input
                type="number"
                defaultValue={5}
                min={1}
                max={30}
                onChange={e => send({ type: 'SET_DURATION', value: Number(e.target.value) })}
                style={{ width: '55px', marginLeft: '0.4rem', padding: '0.2rem' }}
              />
            </label>
            <button onClick={() => send({ type: 'START' })}>Start Timer</button>
          </>
        )}
        {state.matches('running') && (
          <button onClick={() => send({ type: 'CANCEL' })}>Cancel</button>
        )}
        {state.matches('done') && (
          <button onClick={() => send({ type: 'RESET' })}>Reset</button>
        )}
      </div>
    </div>
  );
}
