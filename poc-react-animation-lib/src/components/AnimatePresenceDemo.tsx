import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// AnimatePresence lets components animate OUT before being removed from the DOM
// Without it, React removes elements immediately — no exit animation possible
export default function AnimatePresenceDemo() {
  const [items, setItems] = useState([
    { id: 1, text: 'Buy groceries' },
    { id: 2, text: 'Write tests' },
    { id: 3, text: 'Review PR' },
  ]);
  const [showModal, setShowModal] = useState(false);

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Framer Motion — AnimatePresence</h2>

      {/* List with animated add/remove */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {/* AnimatePresence watches its children — when a child is removed,
            it plays the exit animation before unmounting */}
        <AnimatePresence>
          {items.map(item => (
            <motion.li
              key={item.id}
              layout // animate layout changes when siblings are removed
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, height: 0 }} // plays when removed
              transition={{ duration: 0.25 }}
              style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '0.5rem 1rem', marginBottom: '0.5rem',
                background: '#f0fff4', borderRadius: '6px',
              }}
            >
              {item.text}
              <button onClick={() => removeItem(item.id)}>✕</button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {/* Modal with AnimatePresence */}
      <button onClick={() => setShowModal(true)}>Open Modal</button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', inset: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.4)',
            }}
            onClick={() => setShowModal(false)}
          >
            <div
              style={{ background: '#fff', padding: '2rem', borderRadius: '12px' }}
              onClick={e => e.stopPropagation()}
            >
              <p>This modal animates in and out</p>
              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
