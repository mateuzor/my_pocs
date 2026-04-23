import { block } from 'million/react';

// Million.js: a compiler and runtime that makes React components render faster.
// block() wraps a component and replaces React's virtual DOM diffing with
// Million's fine-grained DOM patching — up to 70% faster for list-heavy UIs.
//
// When to use: components that re-render often with changing data (tables, lists, dashboards).
// When NOT to use: components with complex conditional JSX — block() works best with stable structure.

interface RowData {
  id: number;
  name: string;
  value: number;
}

// A plain React component — renders a table row
function TableRowBase({ id, name, value }: RowData) {
  return (
    <tr>
      <td style={{ padding: '0.4rem 0.75rem', borderBottom: '1px solid #eee' }}>{id}</td>
      <td style={{ padding: '0.4rem 0.75rem', borderBottom: '1px solid #eee' }}>{name}</td>
      <td style={{ padding: '0.4rem 0.75rem', borderBottom: '1px solid #eee', color: value > 50 ? '#276749' : '#c53030' }}>
        {value}
      </td>
    </tr>
  );
}

// block() replaces the React reconciler for this component with Million's faster diffing
const TableRow = block(TableRowBase);

const DATA: RowData[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
  value: Math.floor(Math.random() * 100),
}));

export default function MillionBasic() {
  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>Million.js — block()</h2>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        <code>block()</code> wraps a React component and replaces virtual DOM diffing
        with fine-grained DOM patching — faster for rows that re-render frequently.
      </p>

      <div style={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#f7fafc' }}>
              <th style={{ padding: '0.4rem 0.75rem', textAlign: 'left' }}>#</th>
              <th style={{ padding: '0.4rem 0.75rem', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '0.4rem 0.75rem', textAlign: 'left' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {DATA.map(row => (
              // Each row uses Million's block() diffing instead of React's reconciler
              <TableRow key={row.id} {...row} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
