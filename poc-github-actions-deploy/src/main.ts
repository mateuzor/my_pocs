import { greeting } from './greeting';

// Version info injected by CI (Vite exposes VITE_* vars) to prove which commit is live.
const sha = import.meta.env.VITE_COMMIT_SHA ?? 'local';

document.getElementById('app')!.innerHTML = `
  <h1>${greeting('GitHub Pages')}</h1>
  <p>Deployed commit: <code>${sha}</code></p>`;
