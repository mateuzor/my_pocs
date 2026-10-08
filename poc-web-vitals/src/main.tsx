import { createRoot } from 'react-dom/client';
import { App } from './App';
import { startVitals } from './lib/vitals';

// Register observers as early as possible: LCP/FCP entries can be missed
// if the observers are created after they happen (buffered flag helps, but
// earlier is safer).
startVitals();

createRoot(document.getElementById('root')!).render(<App />);
