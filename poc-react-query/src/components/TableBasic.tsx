import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';

// TanStack Table is a headless table library — it provides the logic (sorting, filtering,
// pagination) but zero UI. You own the markup completely.
// This gives full control over styling without fighting a pre-built component.

interface User {
  id: number;
  name: string;
  age: number;
  role: string;
  salary: number;
}

const DATA: User[] = [
  { id: 1, name: 'Alice', age: 32, role: 'Engineer', salary: 95000 },
  { id: 2, name: 'Bob', age: 28, role: 'Designer', salary: 78000 },
  { id: 3, name: 'Carol', age: 35, role: 'PM', salary: 105000 },
  { id: 4, name: 'David', age: 24, role: 'Engineer', salary: 72000 },
  { id: 5, name: 'Eve', age: 41, role: 'Director', salary: 140000 },
  { id: 6, name: 'Frank', age: 29, role: 'Designer', salary: 82000 },
];

// columnHelper gives type-safe column definitions
const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    // cell: how to render each cell value
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('age', {
    header: 'Age',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('role', {
    header: 'Role',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('salary', {
    header: 'Salary',
    // Format salary as currency
    cell: info => `$${info.getValue().toLocaleString()}`,
  }),
];

export function TableBasic() {
  // sorting state: array of { id: columnId, desc: boolean }
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: DATA,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), // enables client-side sorting
  });

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>TanStack Table — Sorting</h2>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        Click any column header to sort. Click again to reverse. Click a third time to clear.
      </p>

      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.9rem' }}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} style={{ background: '#f7fafc' }}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{
                    padding: '0.6rem 1rem',
                    textAlign: 'left',
                    border: '1px solid #e2e8f0',
                    cursor: header.column.getCanSort() ? 'pointer' : 'default',
                    userSelect: 'none',
                  }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {/* Show sort direction indicator */}
                  {header.column.getIsSorted() === 'asc' ? ' ↑' : header.column.getIsSorted() === 'desc' ? ' ↓' : ' ↕'}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} style={{ padding: '0.5rem 1rem', border: '1px solid #e2e8f0' }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
