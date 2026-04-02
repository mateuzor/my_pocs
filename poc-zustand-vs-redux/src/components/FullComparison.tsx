export function FullComparison() {
  const libs = ['Redux Toolkit', 'Zustand', 'MobX', 'Context API', 'Jotai', 'Recoil', 'XState'];

  const rows: [string, ...string[]][] = [
    ['Mental model',     'Actions/reducers', 'Closures',    'Observables', 'React tree',  'Atoms',         'Atoms + selectors', 'State machines'],
    ['Boilerplate',      'High',             'Low',         'Low',         'Medium',       'Very low',      'Low',               'Medium'],
    ['Provider needed',  'Yes',              'No',          'No',          'Yes',          'No',            'Yes (RecoilRoot)',   'No'],
    ['Derived state',    'createSelector',   'Computed fn', 'computed',    'useMemo',      'Derived atom',  'selector()',        'useSelector'],
    ['Async',            'createAsyncThunk', 'Any async fn','async action','useEffect',    'Async atom',    'Async selector',    'invoke'],
    ['DevTools',         'Built-in',         'Middleware',  'Built-in',    'None',         'Middleware',    'Browser ext',       'State chart'],
    ['Re-render control','useSelector',      'Selectors',   'observer()',  'Whole context','Per-atom',      'Per-atom',          'useSelector'],
    ['Bundle size',      '~12KB',            '~1KB',        '~16KB',       '0KB',          '~3KB',          '~21KB',             '~15KB'],
    ['Best for',         'Large teams',      'Any size',    'OOP apps',    'Simple/rare',  'Perf-critical', 'Large React apps',  'Complex flows'],
  ];

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem', overflowX: 'auto' }}>
      <h3>Full State Management Comparison</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', minWidth: '700px' }}>
        <thead>
          <tr style={{ background: '#2d3748', color: 'white' }}>
            <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #4a5568' }}>Feature</th>
            {libs.map(lib => (
              <th key={lib} style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #4a5568' }}>{lib}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([feature, ...values], i) => (
            <tr key={feature} style={{ background: i % 2 === 0 ? '#f7fafc' : '#fff' }}>
              <td style={{ padding: '0.45rem 0.5rem', border: '1px solid #e2e8f0', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                {feature}
              </td>
              {values.map((val, j) => (
                <td key={j} style={{ padding: '0.45rem 0.5rem', border: '1px solid #e2e8f0' }}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
