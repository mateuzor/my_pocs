import React, { createContext, useContext, useReducer, memo } from 'react';

// Performance problem: when a context value changes, ALL consumers re-render.
// Solution: split context into two — one for data, one for stable actions.
// Components that only call actions skip re-renders when data changes.

const CountStateContext = createContext(null);
const CountActionsContext = createContext(null);

function countReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT': return { count: state.count + 1 };
    case 'DECREMENT': return { count: state.count - 1 };
    case 'RESET': return { count: 0 };
    default: return state;
  }
}

function CountProvider({ children }) {
  const [state, dispatch] = useReducer(countReducer, { count: 0 });

  const actions = {
    increment: () => dispatch({ type: 'INCREMENT' }),
    decrement: () => dispatch({ type: 'DECREMENT' }),
    reset: () => dispatch({ type: 'RESET' }),
  };

  return (
    <CountStateContext.Provider value={state}>
      <CountActionsContext.Provider value={actions}>
        {children}
      </CountActionsContext.Provider>
    </CountStateContext.Provider>
  );
}

// Reads state — re-renders when count changes
function CountDisplay() {
  const { count } = useContext(CountStateContext);
  const renderCount = React.useRef(0);
  renderCount.current++;

  return (
    <div style={{ padding: '0.75rem', background: '#ebf8ff', borderRadius: '6px', marginBottom: '0.5rem' }}>
      Count: <strong>{count}</strong>
      {' — '}render count: <em style={{ color: '#718096' }}>{renderCount.current}</em>
    </div>
  );
}

// Only dispatches — wrapped in memo so it skips re-renders when count changes
const CountActions = memo(function CountActions() {
  const { increment, decrement, reset } = useContext(CountActionsContext);
  const renderCount = React.useRef(0);
  renderCount.current++;

  return (
    <div style={{ padding: '0.75rem', background: '#f0fff4', borderRadius: '6px' }}>
      <button onClick={decrement}>−</button>{' '}
      <button onClick={reset}>Reset</button>{' '}
      <button onClick={increment}>+</button>
      <span style={{ marginLeft: '0.5rem', color: '#718096', fontSize: '0.85rem' }}>
        render count: <em>{renderCount.current}</em>
      </span>
    </div>
  );
});

export default function PerformanceDemo() {
  return (
    <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', marginTop: '1rem' }}>
      <h3>Context Performance — Split State and Actions</h3>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        CountDisplay re-renders on every change. CountActions (with memo) re-renders less.
      </p>
      <CountProvider>
        <CountDisplay />
        <CountActions />
      </CountProvider>
    </div>
  );
}
