import { useState, ReactNode } from 'react';

interface MousePosition { x: number; y: number; }
interface Props { render: (pos: MousePosition) => ReactNode; }

function MouseTracker({ render }: Props) {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  return (
    <div onMouseMove={(e) => setPosition({ x: e.clientX, y: e.clientY })}
         style={{ height: '300px', border: '2px solid #3b82f6', borderRadius: '8px', padding: '20px', backgroundColor: '#eff6ff' }}>
      {render(position)}
    </div>
  );
}

export default MouseTracker;
