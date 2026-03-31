import { useMachine } from '@xstate/react';
import { trafficMachine } from './trafficMachine';

const COLORS: Record<string, string> = {
  red: '#fc8181',
  yellow: '#f6e05e',
  green: '#68d391',
};

export function TrafficLight() {
  // useMachine runs the machine and returns current state + send function
  // state.value is the current state name ('red', 'green', 'yellow')
  // send() dispatches an event to the machine
  const [state, send] = useMachine(trafficMachine);

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>XState — State Machine</h3>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        A finite state machine can only be in one state at a time. Transitions are explicit.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: COLORS[state.value as string],
          border: '3px solid #2d3748',
          transition: 'background 0.3s',
        }} />

        <strong style={{ fontSize: '1.1rem', textTransform: 'uppercase' }}>
          {state.value as string}
        </strong>

        <button
          onClick={() => send({ type: 'NEXT' })}
          style={{ padding: '0.5rem 1.5rem', marginTop: '0.5rem' }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
