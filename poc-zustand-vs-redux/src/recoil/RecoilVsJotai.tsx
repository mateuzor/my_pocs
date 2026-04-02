export function RecoilVsJotai() {
  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>Recoil vs Jotai</h3>
      <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Both use the atomic model — state split into independent units. The APIs are nearly identical.
      </p>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
        <thead>
          <tr style={{ background: '#edf2f7' }}>
            <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #e2e8f0' }}>Feature</th>
            <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #e2e8f0' }}>Recoil</th>
            <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #e2e8f0' }}>Jotai</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['Atom key', 'Required — unique string key per atom', 'Not needed — identity by reference'],
            ['Provider', 'RecoilRoot required', 'No Provider by default'],
            ['Derived state', 'selector() / selectorFamily()', 'derived atom (get) => ...'],
            ['Async', 'selector with async get', 'atom returning Promise + Suspense'],
            ['Persistence', 'atom effects', 'atomWithStorage from jotai/utils'],
            ['Maintainer', 'Meta (Facebook) — less active', 'Community — active'],
            ['Bundle size', '~21KB', '~3KB'],
            ['Best for', 'Large apps needing key-based debugging', 'Small-medium apps, minimal setup'],
          ].map(([feature, recoil, jotai]) => (
            <tr key={feature}>
              <td style={{ padding: '0.45rem 0.5rem', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>{feature}</td>
              <td style={{ padding: '0.45rem 0.5rem', border: '1px solid #e2e8f0' }}>{recoil}</td>
              <td style={{ padding: '0.45rem 0.5rem', border: '1px solid #e2e8f0', color: '#276749' }}>{jotai}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
