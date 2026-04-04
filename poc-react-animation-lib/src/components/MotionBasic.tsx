import { motion } from 'framer-motion';

// motion.div is a regular div that understands animation props
// animate: the target state to animate TO
// initial: the starting state (before animation plays)
// transition: controls duration, easing, delay
export default function MotionBasic() {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Framer Motion — Basic</h2>

      {/* Fade in from opacity 0 and slide up from y=40 */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ background: '#ebf8ff', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}
      >
        I fade in and slide up on mount
      </motion.div>

      {/* Variants let you name animation states and reuse them */}
      <VariantsDemo />
    </div>
  );
}

// Variants: define named animation states outside JSX for clarity
const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

function VariantsDemo() {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      style={{ background: '#fefcbf', padding: '1rem', borderRadius: '8px' }}
    >
      I use named variants (hidden → visible)
    </motion.div>
  );
}
