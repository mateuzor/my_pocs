import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { FeatureFlagsProvider } from './FeatureFlagsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <FeatureFlagsProvider>
    <App />
  </FeatureFlagsProvider>
);
