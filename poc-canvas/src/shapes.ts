// Demo 1: basic primitives drawn once at load.
// Canvas drawing is IMPERATIVE — you issue commands that mutate pixels on
// a bitmap. The context object holds the current style (fillStyle, strokeStyle,
// lineWidth, font, etc.) until you change it — like an OpenGL state machine.

export function drawShapes(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;

  // 1. Filled rectangle
  ctx.fillStyle = '#fed7d7';
  ctx.fillRect(20, 40, 100, 120);
  ctx.strokeStyle = '#c53030';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 40, 100, 120);

  // 2. Path = a sequence of moveTo / lineTo / arc / bezierCurveTo calls.
  // The path is just a description until you call fill() or stroke().
  ctx.beginPath();
  ctx.arc(200, 100, 50, 0, Math.PI * 2);
  ctx.fillStyle = '#90cdf4';
  ctx.fill();
  ctx.strokeStyle = '#2b6cb0';
  ctx.stroke();

  // 3. Triangle via lineTo
  ctx.beginPath();
  ctx.moveTo(320, 40);
  ctx.lineTo(280, 160);
  ctx.lineTo(360, 160);
  ctx.closePath();
  ctx.fillStyle = '#c6f6d5';
  ctx.fill();
  ctx.strokeStyle = '#22543d';
  ctx.stroke();

  // 4. Linear gradient — interpolate between color stops along an axis
  const gradient = ctx.createLinearGradient(420, 40, 580, 160);
  gradient.addColorStop(0, '#f6ad55');
  gradient.addColorStop(0.5, '#ed64a6');
  gradient.addColorStop(1, '#9f7aea');
  ctx.fillStyle = gradient;
  ctx.fillRect(420, 40, 160, 120);

  // 5. Text — also a drawing command
  ctx.fillStyle = '#1a202c';
  ctx.font = 'bold 14px system-ui';
  ctx.textAlign = 'center';
  ['Rect', 'Circle', 'Triangle', 'Gradient'].forEach((label, i) => {
    ctx.fillText(label, 70 + i * 150, 185);
  });
}
