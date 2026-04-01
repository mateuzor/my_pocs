import { useActorRef, useSelector } from '@xstate/react';
import { counterMachine } from './counterMachine';

// useActorRef creates the machine instance (actor) without subscribing to re-renders
// useSelector subscribes to only a specific slice of the machine's snapshot
// This gives fine-grained control over which changes cause re-renders

export function CounterActor() {
  // actorRef is stable — this component never re-renders just from state changes
  const actorRef = useActorRef(counterMachine);

  // useSelector: only re-renders when the selected value changes
  // Component A reads count → only re-renders when count changes
  const count = useSelector(actorRef, s => s.context.count);

  // Component B reads step → only re-renders when step changes
  const step = useSelector(actorRef, s => s.context.step);

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>XState — useActorRef + useSelector</h3>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        useSelector subscribes to only part of the machine. Fine-grained re-render control.
      </p>

      <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{count}</p>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => actorRef.send({ type: 'DECREMENT' })}>− {step}</button>
        <button onClick={() => actorRef.send({ type: 'INCREMENT' })}>+ {step}</button>
        <button onClick={() => actorRef.send({ type: 'RESET' })}>Reset</button>
        <label style={{ fontSize: '0.9rem' }}>
          Step:
          <input
            type="number"
            defaultValue={1}
            min={1}
            onChange={e => actorRef.send({ type: 'SET_STEP', step: Number(e.target.value) })}
            style={{ width: '50px', marginLeft: '0.4rem', padding: '0.2rem' }}
          />
        </label>
      </div>
    </div>
  );
}
