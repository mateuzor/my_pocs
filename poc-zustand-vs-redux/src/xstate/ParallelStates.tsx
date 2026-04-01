import { useMachine } from '@xstate/react';
import { playerMachine } from './playerMachine';

export function ParallelStates() {
  const [state, send] = useMachine(playerMachine);

  // state.value is an object when parallel — each key is a region
  const { playback, volume, display } = state.value as {
    playback: string; volume: string; display: string;
  };

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>XState — Parallel States</h3>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        Three independent regions active simultaneously. Each tracks its own state.
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        <div style={{ padding: '0.75rem', background: '#f7fafc', borderRadius: '6px', flex: 1 }}>
          <strong>Playback:</strong> {playback}
          <div style={{ marginTop: '0.5rem' }}>
            {playback === 'paused'
              ? <button onClick={() => send({ type: 'PLAY' })}>▶ Play</button>
              : <button onClick={() => send({ type: 'PAUSE' })}>⏸ Pause</button>
            }
          </div>
        </div>

        <div style={{ padding: '0.75rem', background: '#f7fafc', borderRadius: '6px', flex: 1 }}>
          <strong>Volume:</strong> {volume}
          <div style={{ marginTop: '0.5rem' }}>
            {volume === 'unmuted'
              ? <button onClick={() => send({ type: 'MUTE' })}>🔇 Mute</button>
              : <button onClick={() => send({ type: 'UNMUTE' })}>🔊 Unmute</button>
            }
          </div>
        </div>

        <div style={{ padding: '0.75rem', background: '#f7fafc', borderRadius: '6px', flex: 1 }}>
          <strong>Display:</strong> {display}
          <div style={{ marginTop: '0.5rem' }}>
            {display === 'windowed'
              ? <button onClick={() => send({ type: 'FULLSCREEN' })}>⛶ Fullscreen</button>
              : <button onClick={() => send({ type: 'EXIT_FULLSCREEN' })}>✕ Exit</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
