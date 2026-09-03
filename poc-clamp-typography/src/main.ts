import './style.css';

// Show the computed font-size next to each step so the fluid effect is visible.
// getComputedStyle returns the resolved px value after clamp() is evaluated.
const items = document.querySelectorAll<HTMLElement>('.scale li');
const label = (el: HTMLElement) => {
  const base = el.dataset.label ?? (el.dataset.label = el.textContent ?? '');
  el.textContent = `${base} - ${parseFloat(getComputedStyle(el).fontSize).toFixed(1)}px`;
};
const update = () => items.forEach(label);
update();
window.addEventListener('resize', update);
