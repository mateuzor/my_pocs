import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { App } from './App';

// RecoilRoot is the provider that holds the atom graph for everything below it.
// Unlike Redux's single store, Recoil's state is a *graph* of independent atoms
// and selectors — components only re-render for the exact nodes they subscribe to.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </StrictMode>
);
