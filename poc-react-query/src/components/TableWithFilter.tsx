import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { useState } from 'react';

// Filtering in TanStack Table works at two levels:
// 1. Global filter — searches across all columns at once
// 2. Column filter — each column has its own independent filter value
// Both can be active simultaneously.

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
}

const PRODUCTS: Product[] = [
  { id: 1, name: 'Laptop Pro', category: 'Electronics', price: 1299, inStock: true },
  { id: 2, name: 'Wireless Mouse', category: 'Electronics', price: 49, inStock: true },
  { id: 3, name: 'Standing Desk', category: 'Furniture', price: 599, inStock: false },
  { id: 4, name: 'Monitor 4K', category: 'Electronics', price: 799, inStock: true },
  { id: 5, name: 'Ergonomic Chair', category: 'Furniture', price: 399, inStock: true },
  { id: 6, name: 'USB-C Hub', category: 'Electronics', price: 79, inStock: false },
  { id: 7, name: 'Bookshelf', category: 'Furniture', price: 249, inStock: true },
];

const columnHelper = createColumnHelper<Product>();

const columns = [
  columnHelper.accessor('name', { header: 'Product', cell: i => i.getValue() }),
  columnHelper.accessor('category', { header: 'Category', cell: i => i.getValue() }),
  columnHelper.accessor('price', {
    header: 'Price',
    cell: i => `$${i.getValue()}`,
  }),
  columnHelper.accessor('inStock', {
    header: 'In Stock',
    cell: i => i.getValue() ? '✓' : '✗',
    // Custom filter function: match boolean from a string "true"/"false"
    filterFn: (row, columnId, filterValue) => {
      if (filterValue === '') return true;
      return String(row.getValue(columnId)) === filterValue;
    },
  }),
];

export function TableWithFilter() {
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: PRODUCTS,
    columns,
    state: { globalFilter, columnFilters },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // enables filtering
    getSortedRowModel: getSortedRowModel(),
    // globalFilterFn controls which columns the global search applies to
    globalFilterFn: 'includesString',
  });

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>TanStack Table — Filtering</h2>

      {/* Global filter */}
      <input
        value={globalFilter}
        onChange={e => setGlobalFilter(e.target.value)}
        placeholder="Search all columns..."
        style={{ padding: '0.4rem 0.75rem', marginBottom: '0.75rem', width: 240 }}
      />

      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.9rem' }}>
        <thead>
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id} style={{ background: '#f7fafc' }}>
              {hg.headers.map(header => (
                <th key={header.id} style={{ padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {/* Per-column filter input rendered below the header label */}
                  {header.column.getCanFilter() && (
                    <div>
                      <input
                        value={(header.column.getFilterValue() as string) ?? ''}
                        onChange={e => header.column.setFilterValue(e.target.value)}
                        placeholder="Filter..."
                        style={{ width: '90%', fontSize: '0.75rem', padding: '2px 4px', marginTop: '4px' }}
                      />
                    </div>
                  )}
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
        <tfoot>
          <tr>
            <td colSpan={columns.length} style={{ padding: '0.5rem 0.75rem', color: '#718096', fontSize: '0.85rem' }}>
              Showing {table.getRowModel().rows.length} of {PRODUCTS.length} products
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
