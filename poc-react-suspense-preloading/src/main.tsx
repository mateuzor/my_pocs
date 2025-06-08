import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading app...</div>}>
      <App />
    </Suspense>
  </React.StrictMode>
);