import { useEffect, useRef, useState } from 'react';

// Custom hook that returns a ref and a boolean indicating if the element is visible
function useReveal(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Once visible, stay visible — unobserve to avoid toggling back
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2, ...options }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}

function RevealCard({ title, description, delay = 0 }) {
  const [ref, isVisible] = useReveal();

  return (
    <div
      ref={ref}
      style={{
        padding: '1.25rem',
        marginBottom: '0.75rem',
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        // CSS transition driven by the isVisible state
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms`,
      }}
    >
      <strong>{title}</strong>
      <p style={{ margin: '0.25rem 0 0', color: '#555', fontSize: '0.9rem' }}>{description}</p>
    </div>
  );
}

export function RevealOnScroll() {
  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>Reveal on Scroll</h3>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>Scroll down — each card fades in when it enters the viewport.</p>

      <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '0.5rem' }}>
        {Array.from({ length: 8 }, (_, i) => (
          <RevealCard
            key={i}
            title={`Section ${i + 1}`}
            description={`This card animates in when it crosses the 20% threshold.`}
            delay={i * 60} // stagger each card by 60ms
          />
        ))}
      </div>
    </div>
  );
}
