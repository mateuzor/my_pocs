import React from 'react';
import { createRoot } from 'react-dom/client';
import { SWRConfig } from 'swr';
import { App } from './App';

// SWRConfig sets global defaults for every hook below it.
createRoot(document.getElementById('root')!).render(
  <SWRConfig value={{ dedupingInterval: 2000, revalidateOnFocus: true, errorRetryCount: 2 }}>
    <App />
  </SWRConfig>,
);
