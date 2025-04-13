import React from 'react';
import { useFeatureFlags } from './FeatureFlagsContext';

export default function App() {
  const { flags, toggleFlag } = useFeatureFlags();

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Feature Flags POC</h1>

      <button onClick={() => toggleFlag('showNewBanner')}>
        Toggle New Banner
      </button>
      <button onClick={() => toggleFlag('enableBetaFeature')} style={{ marginLeft: '1rem' }}>
        Toggle Beta Feature
      </button>

      {flags.showNewBanner && <div style={{ marginTop: '1rem', color: 'green' }}>✅ New Banner is visible!</div>}
      {flags.enableBetaFeature && <div style={{ marginTop: '1rem', color: 'blue' }}>🧪 Beta Feature Enabled!</div>}
    </div>
  );
}
