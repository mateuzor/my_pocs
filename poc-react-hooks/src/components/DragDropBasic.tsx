import { useState } from 'react';

interface Item {
  id: number;
  label: string;
  color: string;
}

const INITIAL_ITEMS: Item[] = [
  { id: 1, label: 'Apple', color: '#ffadad' },
  { id: 2, label: 'Banana', color: '#ffd6a5' },
  { id: 3, label: 'Cherry', color: '#fdffb6' },
  { id: 4, label: 'Grape', color: '#caffbf' },
];

export function DragDropBasic() {
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [overZone, setOverZone] = useState<'list' | 'bin' | null>(null);
  const [bin, setBin] = useState<Item[]>([]);

  // dragstart fires when the user starts dragging an element
  const handleDragStart = (id: number) => {
    setDraggingId(id);
  };

  // dragend fires when the drag operation ends (drop or cancel)
  const handleDragEnd = () => {
    setDraggingId(null);
    setOverZone(null);
  };

  // dragover must call preventDefault() to allow dropping — default is to deny drops
  const handleDragOver = (e: React.DragEvent, zone: 'list' | 'bin') => {
    e.preventDefault();
    setOverZone(zone);
  };

  const handleDropOnBin = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggingId === null) return;

    const item = items.find(i => i.id === draggingId);
    if (item) {
      // Move item from list to bin
      setItems(prev => prev.filter(i => i.id !== draggingId));
      setBin(prev => [...prev, item]);
    }

    setDraggingId(null);
    setOverZone(null);
  };

  const handleDropOnList = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggingId === null) return;

    const item = bin.find(i => i.id === draggingId);
    if (item) {
      // Move item back from bin to list
      setBin(prev => prev.filter(i => i.id !== draggingId));
      setItems(prev => [...prev, item]);
    }

    setDraggingId(null);
    setOverZone(null);
  };

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>Drag and Drop — Basic</h3>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>Drag items to the bin. Drag them back to the list.</p>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', marginTop: '1rem' }}>
        {/* Drop zone: list */}
        <div
          onDragOver={e => handleDragOver(e, 'list')}
          onDrop={handleDropOnList}
          style={{
            minWidth: '160px', minHeight: '120px', padding: '0.75rem',
            border: `2px dashed ${overZone === 'list' ? '#4299e1' : '#cbd5e0'}`,
            borderRadius: '8px', transition: 'border-color 0.2s',
          }}
        >
          <strong>Items</strong>
          <div style={{ marginTop: '0.5rem' }}>
            {items.map(item => (
              <div
                key={item.id}
                draggable // makes the element draggable
                onDragStart={() => handleDragStart(item.id)}
                onDragEnd={handleDragEnd}
                style={{
                  background: item.color,
                  padding: '0.4rem 0.75rem',
                  borderRadius: '4px',
                  marginBottom: '0.4rem',
                  cursor: 'grab',
                  opacity: draggingId === item.id ? 0.4 : 1,
                  userSelect: 'none',
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Drop zone: bin */}
        <div
          onDragOver={e => handleDragOver(e, 'bin')}
          onDrop={handleDropOnBin}
          style={{
            minWidth: '160px', minHeight: '120px', padding: '0.75rem',
            border: `2px dashed ${overZone === 'bin' ? '#e53e3e' : '#cbd5e0'}`,
            borderRadius: '8px', background: overZone === 'bin' ? '#fff5f5' : '#fafafa',
            transition: 'all 0.2s',
          }}
        >
          <strong>Bin</strong>
          <div style={{ marginTop: '0.5rem' }}>
            {bin.map(item => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(item.id)}
                onDragEnd={handleDragEnd}
                style={{
                  background: item.color, opacity: 0.6,
                  padding: '0.4rem 0.75rem', borderRadius: '4px',
                  marginBottom: '0.4rem', cursor: 'grab',
                  textDecoration: 'line-through', userSelect: 'none',
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
