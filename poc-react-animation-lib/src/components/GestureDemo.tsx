import { useState } from 'react';
import { motion, useDragControls } from 'framer-motion';

// Framer Motion has built-in gesture detection:
// whileHover: styles to apply while the cursor is over the element
// whileTap: styles while the element is being clicked/pressed
// whileDrag: styles while being dragged
// drag: enables dragging — "x", "y", or true (both axes)
export default function GestureDemo() {
  const [likeCount, setLikeCount] = useState(0);
  const dragControls = useDragControls(); // lets you start drag from a handle

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Framer Motion — Gestures</h2>

      {/* Hover + tap animations — no useState needed, Framer handles it */}
      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: '#3182ce' }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        onClick={() => setLikeCount(c => c + 1)}
        style={{
          padding: '0.75rem 1.5rem', background: '#4299e1',
          color: '#fff', border: 'none', borderRadius: '8px',
          cursor: 'pointer', marginBottom: '2rem',
        }}
      >
        Like ({likeCount})
      </motion.button>

      {/* Freely draggable card */}
      <p style={{ color: '#555', fontSize: '0.9rem' }}>Drag the card below anywhere:</p>
      <motion.div
        drag // allow dragging on both axes
        dragElastic={0.2} // resistance at the edges (0 = no elasticity)
        dragMomentum={false} // stop immediately when released
        whileDrag={{ scale: 1.05, boxShadow: '0 10px 30px rgba(0,0,0,0.2)', cursor: 'grabbing' }}
        style={{
          width: 160, padding: '1rem', background: '#f6e05e',
          borderRadius: '12px', cursor: 'grab', userSelect: 'none',
          textAlign: 'center',
        }}
      >
        Drag me
      </motion.div>

      {/* Constrained drag with a custom handle */}
      <p style={{ color: '#555', fontSize: '0.9rem', marginTop: '2rem' }}>
        Drag this card horizontally only (constrained):
      </p>
      <div style={{ overflow: 'hidden', background: '#eee', borderRadius: '12px', padding: '0.5rem' }}>
        <motion.div
          drag="x" // x-axis only
          dragConstraints={{ left: 0, right: 200 }} // hard limits in pixels
          dragControls={dragControls}
          style={{
            width: 80, height: 40, background: '#9f7aea',
            borderRadius: '8px', cursor: 'grab',
          }}
        />
      </div>
    </div>
  );
}
