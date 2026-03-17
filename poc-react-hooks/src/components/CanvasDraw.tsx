import { useRef, useState } from 'react';

export function CanvasDraw() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Track whether the mouse button is held down
  const isDrawing = useRef(false);
  const [color, setColor] = useState('#2d3748');
  const [size, setSize] = useState(4);

  // Get the 2D rendering context from the canvas element
  const getCtx = () => canvasRef.current?.getContext('2d') ?? null;

  const startDrawing = (e: React.MouseEvent) => {
    const ctx = getCtx();
    if (!ctx) return;
    isDrawing.current = true;

    // beginPath starts a new path — without this, lineTo would connect to a previous path
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing.current) return;
    const ctx = getCtx();
    if (!ctx) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';   // round end caps make strokes look smoother
    ctx.lineJoin = 'round';

    // lineTo adds a point to the current path — stroke() renders it
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (!canvas || !ctx) return;
    // clearRect erases the entire canvas area
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>Canvas — Freehand Drawing</h3>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem' }}>
        <label>Color: <input type="color" value={color} onChange={e => setColor(e.target.value)} /></label>
        <label>Size: <input type="range" min={1} max={20} value={size} onChange={e => setSize(Number(e.target.value))} /></label>
        <button onClick={clearCanvas}>Clear</button>
      </div>

      <canvas
        ref={canvasRef}
        width={500}
        height={300}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ border: '1px solid #cbd5e0', borderRadius: '6px', cursor: 'crosshair', display: 'block' }}
      />
    </div>
  );
}
