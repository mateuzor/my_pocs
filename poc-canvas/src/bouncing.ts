// Demo 2: animation loop with requestAnimationFrame.
// The animation pattern is: clear → update positions → redraw → schedule next.
// requestAnimationFrame syncs with the browser's repaint, so we get a smooth
// ~60fps without overdrawing.

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
}

const COLORS = ['#4299e1', '#48bb78', '#ed8936', '#9f7aea', '#f56565', '#38b2ac'];

export function startBouncing(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  const balls: Ball[] = [];
  let running = true;
  let rafId = 0;

  function spawnBall() {
    balls.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      r: 8 + Math.random() * 16,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
  }

  // Start with 5 balls
  for (let i = 0; i < 5; i++) spawnBall();

  function frame() {
    // 1. Clear — fillRect with a semi-transparent background creates motion trails;
    //    use clearRect for sharp redraws.
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Update + draw each ball
    for (const ball of balls) {
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Bounce off walls
      if (ball.x - ball.r < 0 || ball.x + ball.r > canvas.width) ball.vx *= -1;
      if (ball.y - ball.r < 0 || ball.y + ball.r > canvas.height) ball.vy *= -1;

      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fillStyle = ball.color;
      ctx.fill();
    }

    // 3. Schedule the next frame
    if (running) rafId = requestAnimationFrame(frame);
  }

  rafId = requestAnimationFrame(frame);

  return {
    toggle() {
      running = !running;
      if (running) rafId = requestAnimationFrame(frame);
      else cancelAnimationFrame(rafId);
      return running;
    },
    addBall: spawnBall,
  };
}
