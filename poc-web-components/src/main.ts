import './style.css';
import './components/ui-badge';
import './components/ui-card';
import './components/ui-counter';

const counter = document.querySelector('ui-counter')!;
const log = document.getElementById('log')!;

counter.addEventListener('change', (e) => {
  log.textContent = `change event, value = ${(e as CustomEvent<{ value: number }>).detail.value}`;
});

// Property access from JS: no attribute stringification needed.
counter.value = 10;
