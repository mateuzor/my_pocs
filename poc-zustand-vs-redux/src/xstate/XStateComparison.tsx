export function XStateComparison() {
  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>XState vs Other State Managers</h3>
      <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '1rem' }}>
        XState is fundamentally different — it models behaviour, not just data.
      </p>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
        <thead>
          <tr style={{ background: '#edf2f7' }}>
            <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #e2e8f0' }}>Aspect</th>
            <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #e2e8f0' }}>Redux / Zustand / Jotai</th>
            <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #e2e8f0' }}>XState</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['Mental model', 'Data store — what values are stored', 'Behaviour — what states are possible'],
            ['Impossible states', 'You must guard against them manually', 'Impossible by definition — machine only has valid transitions'],
            ['Async', 'Manual loading/error flags', 'invoke — states are loading, success, error'],
            ['Side effects', 'Middleware (thunk, saga)', 'actions, services — built into the machine'],
            ['Debugging', 'DevTools shows state changes', 'Visual state chart — you can see all states and transitions'],
            ['Complexity', 'Simple for simple state', 'Powerful for complex flows (multi-step, wizards, async sequences)'],
            ['Learning curve', 'Low', 'Higher — state machine concepts'],
            ['Best for', 'UI state, server cache', 'Complex flows: auth, checkout, forms, media players'],
          ].map(([aspect, others, xstate]) => (
            <tr key={aspect}>
              <td style={{ padding: '0.45rem 0.5rem', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>{aspect}</td>
              <td style={{ padding: '0.45rem 0.5rem', border: '1px solid #e2e8f0' }}>{others}</td>
              <td style={{ padding: '0.45rem 0.5rem', border: '1px solid #e2e8f0', color: '#2b6cb0' }}>{xstate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
