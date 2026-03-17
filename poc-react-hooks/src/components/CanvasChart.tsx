import { useRef, useEffect, useState } from 'react';

interface Bar {
  label: string;
  value: number;
  color: string;
}

const DATA: Bar[] = [
  { label: 'Jan', value: 65, color: '#4299e1' },
  { label: 'Feb', value: 82, color: '#48bb78' },
  { label: 'Mar', value: 47, color: '#ed8936' },
  { label: 'Apr', value: 91, color: '#9f7aea' },
  { label: 'May', value: 73, color: '#f56565' },
  { label: 'Jun', value: 58, color: '#38b2ac' },
];

export function CanvasChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // progress goes from 0 to 1, driving the animation
  const progressRef = useRef(0);
  const rafRef = useRef<number>(0);
  const [animating, setAnimating] = useState(false);

  const drawChart = (progress: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const padding = 40;
    const barWidth = (W - padding * 2) / DATA.length - 8;
    const maxValue = Math.max(...DATA.map(d => d.value));

    ctx.clearRect(0, 0, W, H);

    // Draw baseline
    ctx.beginPath();
    ctx.strokeStyle = '#e2e8f0';
    ctx.moveTo(padding, H - padding);
    ctx.lineTo(W - padding, H - padding);
    ctx.stroke();

    DATA.forEach((bar, i) => {
      const x = padding + i * ((W - padding * 2) / DATA.length) + 4;
      // Multiply bar height by progress for the grow-from-bottom animation
      const fullHeight = ((bar.value / maxValue) * (H - padding * 2));
      const currentHeight = fullHeight * progress;
      const y = H - padding - currentHeight;

      // Draw bar
      ctx.fillStyle = bar.color;
      ctx.fillRect(x, y, barWidth, currentHeight);

      // Draw label below baseline
      ctx.fillStyle = '#4a5568';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(bar.label, x + barWidth / 2, H - padding + 16);

      // Draw value on top of bar (only when mostly grown)
      if (progress > 0.7) {
        ctx.fillStyle = '#2d3748';
        ctx.fillText(String(bar.value), x + barWidth / 2, y - 4);
      }
    });
  };

  const animate = () => {
    // requestAnimationFrame schedules the next frame — ~60fps
    progressRef.current += 0.03;
    if (progressRef.current >= 1) {
      progressRef.current = 1;
      drawChart(1);
      setAnimating(false);
      return;
    }
    drawChart(progressRef.current);
    rafRef.current = requestAnimationFrame(animate);
  };

  const startAnimation = () => {
    // Cancel any running animation before starting a new one
    cancelAnimationFrame(rafRef.current);
    progressRef.current = 0;
    setAnimating(true);
    rafRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    drawChart(1); // draw immediately on mount
    // Cleanup: cancel animation frame on unmount
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>Canvas — Animated Bar Chart</h3>
      <canvas
        ref={canvasRef}
        width={500}
        height={280}
        style={{ border: '1px solid #e2e8f0', borderRadius: '6px', display: 'block' }}
      />
      <button onClick={startAnimation} disabled={animating} style={{ marginTop: '0.75rem', padding: '0.4rem 1rem' }}>
        {animating ? 'Animating...' : 'Replay Animation'}
      </button>
    </div>
  );
}
