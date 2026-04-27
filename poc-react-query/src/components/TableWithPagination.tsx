import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

// getPaginationRowModel slices the data into pages client-side.
// The table keeps track of pageIndex and pageSize in its state.
// You can also do server-side pagination by controlling these manually.

interface Employee {
  id: number;
  name: string;
  department: string;
  startYear: number;
}

// Generate 50 fake employees to demonstrate pagination
const EMPLOYEES: Employee[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Employee ${i + 1}`,
  department: ['Engineering', 'Design', 'Marketing', 'Sales', 'HR'][i % 5],
  startYear: 2015 + (i % 10),
}));

const columnHelper = createColumnHelper<Employee>();

const columns = [
  columnHelper.accessor('id', { header: '#', cell: i => i.getValue() }),
  columnHelper.accessor('name', { header: 'Name', cell: i => i.getValue() }),
  columnHelper.accessor('department', { header: 'Department', cell: i => i.getValue() }),
  columnHelper.accessor('startYear', { header: 'Since', cell: i => i.getValue() }),
];

export function TableWithPagination() {
  const table = useReactTable({
    data: EMPLOYEES,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // Default page size
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>TanStack Table — Pagination</h2>

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
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} style={{ padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0' }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
        <button onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}>{'«'}</button>
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>{'‹'}</button>

        <span>
          Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{' '}
          <strong>{table.getPageCount()}</strong>
        </span>

        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>{'›'}</button>
        <button onClick={() => table.lastPage()} disabled={!table.getCanNextPage()}>{'»'}</button>

        {/* Page size selector */}
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => table.setPageSize(Number(e.target.value))}
          style={{ marginLeft: '0.5rem' }}
        >
          {[5, 10, 20].map(size => (
            <option key={size} value={size}>Show {size}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
