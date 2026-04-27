import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowSelectionState,
} from '@tanstack/react-table';
import { useState } from 'react';

// Row selection: TanStack Table tracks selected rows by their ID.
// A special checkbox column is added manually — the library does not add UI,
// you wire up the checkboxes to the table's selection handlers.

interface Task {
  id: string;
  title: string;
  priority: 'Low' | 'Medium' | 'High';
  done: boolean;
}

const TASKS: Task[] = [
  { id: 't1', title: 'Fix login bug', priority: 'High', done: false },
  { id: 't2', title: 'Update README', priority: 'Low', done: true },
  { id: 't3', title: 'Add unit tests', priority: 'Medium', done: false },
  { id: 't4', title: 'Deploy to staging', priority: 'High', done: false },
  { id: 't5', title: 'Review PR #42', priority: 'Medium', done: true },
];

const columnHelper = createColumnHelper<Task>();

const columns = [
  // Checkbox column — not backed by a data field, defined with display()
  columnHelper.display({
    id: 'select',
    // Header checkbox: selects/deselects all rows
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllRowsSelected()}
        // indeterminate shows a dash when only some rows are selected
        ref={el => el && (el.indeterminate = table.getIsSomeRowsSelected())}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  }),
  columnHelper.accessor('title', { header: 'Task', cell: i => i.getValue() }),
  columnHelper.accessor('priority', {
    header: 'Priority',
    cell: i => {
      const p = i.getValue();
      const color = p === 'High' ? '#c53030' : p === 'Medium' ? '#b7791f' : '#276749';
      return <span style={{ color, fontWeight: 600 }}>{p}</span>;
    },
  }),
  columnHelper.accessor('done', {
    header: 'Status',
    cell: i => i.getValue() ? '✓ Done' : '○ Open',
  }),
];

export function TableWithSelection() {
  // rowSelection maps rowId → true/false
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data: TASKS,
    columns,
    // Use the task's id field as the row ID (default is the array index)
    getRowId: row => row.id,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
  });

  const selectedIds = Object.keys(rowSelection).filter(k => rowSelection[k]);

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>TanStack Table — Row Selection</h2>

      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
        <thead>
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id} style={{ background: '#f7fafc' }}>
              {hg.headers.map(h => (
                <th key={h.id} style={{ padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} style={{ background: row.getIsSelected() ? '#ebf8ff' : 'transparent' }}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} style={{ padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0' }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {selectedIds.length > 0 && (
        <div style={{ padding: '0.75rem', background: '#ebf8ff', borderRadius: '6px', fontSize: '0.85rem' }}>
          Selected: <strong>{selectedIds.join(', ')}</strong>
          <button
            style={{ marginLeft: '0.75rem', fontSize: '0.8rem' }}
            onClick={() => setRowSelection({})}
          >
            Clear selection
          </button>
        </div>
      )}
    </div>
  );
}
