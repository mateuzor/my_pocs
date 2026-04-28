// Side-by-side comparison of react-window vs @tanstack/react-virtual

export function VirtualComparison() {
  const rows = [
    {
      feature: 'API style',
      reactWindow: 'Component-based (wrap your list in <FixedSizeList>)',
      tanstackVirtual: 'Hook-based (useVirtualizer returns positions, you write markup)',
    },
    {
      feature: 'Markup control',
      reactWindow: 'Limited — must use the component\'s render pattern',
      tanstackVirtual: 'Full — you own every element',
    },
    {
      feature: 'Variable heights',
      reactWindow: 'VariableSizeList — needs itemSize function up front',
      tanstackVirtual: 'measureElement — measures actual DOM height automatically',
    },
    {
      feature: 'Horizontal scroll',
      reactWindow: 'FixedSizeGrid / VariableSizeGrid',
      tanstackVirtual: 'horizontal: true option on useVirtualizer',
    },
    {
      feature: 'Bundle size',
      reactWindow: '~6kB gzipped',
      tanstackVirtual: '~4kB gzipped',
    },
    {
      feature: 'TypeScript',
      reactWindow: 'Needs @types/react-window',
      tanstackVirtual: 'Built-in types',
    },
    {
      feature: 'Best for',
      reactWindow: 'Quick setup, standard lists and grids',
      tanstackVirtual: 'Custom layouts, dynamic heights, full control',
    },
  ];

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>react-window vs TanStack Virtual</h2>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        Both virtualize large lists — the difference is how much control you have over the markup.
      </p>

      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ background: '#f7fafc' }}>
            {['Feature', 'react-window', '@tanstack/react-virtual'].map(h => (
              <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', border: '1px solid #e2e8f0' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.feature}>
              <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0', fontWeight: 600, whiteSpace: 'nowrap' }}>{row.feature}</td>
              <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0' }}>{row.reactWindow}</td>
              <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0' }}>{row.tanstackVirtual}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
