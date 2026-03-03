import React from 'react';

// Card is a second remote component — this shows that a remote app
// can expose multiple independent components to different hosts
export default function Card({ title, description, color = '#0070f3' }) {
  return (
    <div style={{
      border: `2px solid ${color}`,
      borderRadius: '8px',
      padding: '1rem',
      maxWidth: '300px',
      fontFamily: 'sans-serif',
    }}>
      {/* Title bar uses the dynamic color prop passed from the host */}
      <div style={{ background: color, color: 'white', padding: '0.5rem', margin: '-1rem -1rem 1rem', borderRadius: '6px 6px 0 0' }}>
        <strong>{title}</strong>
      </div>
      <p style={{ color: '#555', margin: 0 }}>{description}</p>
    </div>
  );
}
