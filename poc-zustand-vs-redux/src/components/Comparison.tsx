export function Comparison() {
  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>Zustand vs Redux Toolkit — Comparison</h3>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
        <thead>
          <tr style={{ background: '#edf2f7' }}>
            <th style={{ padding: '0.6rem', textAlign: 'left', border: '1px solid #e2e8f0' }}>Feature</th>
            <th style={{ padding: '0.6rem', textAlign: 'left', border: '1px solid #e2e8f0' }}>Zustand</th>
            <th style={{ padding: '0.6rem', textAlign: 'left', border: '1px solid #e2e8f0' }}>Redux Toolkit</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['Boilerplate', 'Minimal — just create()', 'More — slice + actions + selectors'],
            ['Setup', 'No Provider needed', 'Requires <Provider store={store}>'],
            ['Async', 'Any async function in store', 'createAsyncThunk (structured)'],
            ['DevTools', 'Via devtools middleware', 'Built-in with Redux DevTools'],
            ['Persistence', 'Via persist middleware', 'Manual or redux-persist'],
            ['Best for', 'Small-medium apps, fast setup', 'Large apps, strict patterns'],
            ['Bundle size', '~1KB', '~12KB'],
          ].map(([feature, zustand, redux]) => (
            <tr key={feature}>
              <td style={{ padding: '0.5rem 0.6rem', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>{feature}</td>
              <td style={{ padding: '0.5rem 0.6rem', border: '1px solid #e2e8f0', color: '#276749' }}>{zustand}</td>
              <td style={{ padding: '0.5rem 0.6rem', border: '1px solid #e2e8f0', color: '#2b6cb0' }}>{redux}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
