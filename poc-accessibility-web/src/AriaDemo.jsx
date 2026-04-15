import { useState } from 'react';

// ARIA attributes communicate element roles and states to screen readers.
export default function AriaDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  return (
    <section style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginTop: '1rem' }}>
      <h2>ARIA Roles Demo</h2>

      {/* aria-expanded tells screen readers whether this section is open */}
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem' }}>Accordion</h3>
        <button
          onClick={() => setIsOpen(o => !o)}
          aria-expanded={isOpen}
          aria-controls="accordion-panel"
          style={{ padding: '0.4rem 0.75rem' }}
        >
          {isOpen ? 'Collapse' : 'Expand'} details
        </button>
        <div
          id="accordion-panel"
          role="region"
          aria-hidden={!isOpen}
          style={{ display: isOpen ? 'block' : 'none', padding: '0.5rem', background: '#f7fafc', borderRadius: '4px', marginTop: '0.5rem' }}
        >
          This content is announced when expanded.
        </div>
      </div>

      {/* Custom checkbox — role + aria-checked replace native input semantics */}
      <div>
        <h3 style={{ fontSize: '1rem' }}>Custom Checkbox</h3>
        <div
          role="checkbox"
          aria-checked={checked}
          tabIndex={0}
          onClick={() => setChecked(c => !c)}
          onKeyDown={e => e.key === ' ' && setChecked(c => !c)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
        >
          <span style={{
            width: 18, height: 18, border: '2px solid #4299e1', borderRadius: '3px',
            background: checked ? '#4299e1' : '#fff', display: 'inline-block',
          }} />
          Accept terms and conditions
        </div>
      </div>
    </section>
  );
}
