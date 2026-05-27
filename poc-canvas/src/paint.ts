// Demo 3: interactive drawing — capture pointer events on the canvas.
// Pattern: on pointerdown, start a path. On pointermove (while down), extend
// it with lineTo and stroke. On pointerup, finalize.

interface PaintControls {
  color: string;
  size: number;
}

export function startPaint(
  canvas: HTMLCanvasElement,
  controls: PaintControls
): { clear: () => void } {
  const ctx = canvas.getContext('2d')!;
  let drawing = false;
  let lastX = 0;
  let lastY = 0;

  // Convert pointer event to canvas-local coordinates.
  // getBoundingClientRect handles the case where the canvas isn't at (0,0)
  // or has been resized via CSS independently from its internal resolution.
  function getXY(e: PointerEvent): [number, number] {
    const rect = canvas.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top];
  }

  canvas.addEventListener('pointerdown', (e) => {
    drawing = true;
    [lastX, lastY] = getXY(e);
    // setPointerCapture ensures we keep receiving events even if the cursor
    // leaves the canvas. Without it, fast strokes can be cut off at the edge.
    canvas.setPointerCapture(e.pointerId);
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!drawing) return;
    const [x, y] = getXY(e);

    ctx.strokeStyle = controls.color;
    ctx.lineWidth = controls.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastX = x;
    lastY = y;
  });

  canvas.addEventListener('pointerup', () => {
    drawing = false;
  });

  canvas.addEventListener('pointerleave', () => {
    drawing = false;
  });

  return {
    clear() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
  };
}
