import React from "react";
import Button from "remote/Button";
import Card from "remote/Card";  // consume the second remote component

export default function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>Host App</h1>
      <p style={{ color: '#555' }}>Components below are loaded from the remote app at runtime:</p>

      {/* Each remote component is a separate federated module — independent chunks */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap', marginTop: '1rem' }}>
        <Button />
        <Card
          title="Remote Card"
          description="This card component lives in the remote app and is loaded via Module Federation."
          color="#7928ca"
        />
      </div>
    </div>
  );
}
