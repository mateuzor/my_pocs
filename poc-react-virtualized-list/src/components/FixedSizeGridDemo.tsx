import { FixedSizeGrid, GridChildComponentProps } from 'react-window';

// FixedSizeGrid virtualizes BOTH rows AND columns
// Useful for spreadsheets, image galleries, data tables
// columnCount / rowCount: total dimensions of the grid
// columnWidth / rowHeight: size of each cell in pixels

const ROW_COUNT = 1000;
const COL_COUNT = 20;

// Cell is called only for visible cells — both axes are virtualized
function Cell({ columnIndex, rowIndex, style }: GridChildComponentProps) {
  const isEven = (rowIndex + columnIndex) % 2 === 0;
  return (
    <div
      style={{
        ...style, // top, left, width, height injected by react-window
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isEven ? '#f7fafc' : '#edf2f7',
        borderRight: '1px solid #e2e8f0',
        borderBottom: '1px solid #e2e8f0',
        fontSize: '0.75rem',
        color: '#4a5568',
      }}
    >
      {rowIndex},{columnIndex}
    </div>
  );
}

export default function FixedSizeGridDemo() {
  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>react-window — FixedSizeGrid</h2>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        1,000 rows × 20 columns = 20,000 cells — only visible cells render
      </p>

      <FixedSizeGrid
        columnCount={COL_COUNT}
        columnWidth={80}   // each column is 80px wide
        height={400}       // visible area height
        rowCount={ROW_COUNT}
        rowHeight={35}     // each row is 35px tall
        width={600}        // visible area width (scrolls horizontally too)
      >
        {Cell}
      </FixedSizeGrid>
    </div>
  );
}
