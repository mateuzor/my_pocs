import { useRef, useEffect, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number; // velocity x
  vy: number; // velocity y
  radius: number;
  color: string;
  alpha: number;
}

function createParticle(w: number, h: number): Particle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    radius: Math.random() * 3 + 1,
    color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    alpha: Math.random() * 0.7 + 0.3,
  };
}

export function CanvasParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Initialize particles
    particlesRef.current = Array.from({ length: 80 }, () =>
      createParticle(canvas.width, canvas.height)
    );

    const loop = () => {
      const { width: W, height: H } = canvas;

      // Semi-transparent clear creates a fade trail effect
      // Instead of clearRect (instant erase), fillRect with low alpha leaves ghost trails
      ctx.fillStyle = 'rgba(15, 20, 30, 0.15)';
      ctx.fillRect(0, 0, W, H);

      particlesRef.current.forEach((p) => {
        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls — reverse velocity when hitting an edge
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    // Cleanup: stop the loop when component unmounts
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const togglePause = () => {
    if (running) {
      cancelAnimationFrame(rafRef.current);
    } else {
      // Resume by restarting the loop — useEffect above won't re-run
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;
      const loop = () => {
        ctx.fillStyle = 'rgba(15, 20, 30, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        particlesRef.current.forEach((p) => {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
          ctx.globalAlpha = 1;
        });
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    }
    setRunning(r => !r);
  };

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>Canvas — Particle Animation</h3>
      <canvas
        ref={canvasRef}
        width={500}
        height={280}
        style={{ display: 'block', borderRadius: '6px', background: '#0f141e' }}
      />
      <button onClick={togglePause} style={{ marginTop: '0.75rem', padding: '0.4rem 1rem' }}>
        {running ? 'Pause' : 'Resume'}
      </button>
    </div>
  );
}
