import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SignupWizard } from './components/SignupWizard';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1>XState POC</h1>
      <p style={{ color: '#555' }}>
        A signup flow modeled as a finite state machine. Every screen, button,
        and error message is derived from <code>state.matches(...)</code> — no
        boolean flags, no impossible states.
      </p>
      <SignupWizard />
    </main>
  </StrictMode>
);
