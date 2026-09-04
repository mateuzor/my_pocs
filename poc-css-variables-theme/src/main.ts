import './style.css';
import { clearTheme, currentTheme, onSystemChange, setTheme } from './theme';

const label = document.querySelector<HTMLSpanElement>('#current')!;
const render = () => {
  const saved = localStorage.getItem('theme');
  label.textContent = `${currentTheme()}${saved ? ' (manual)' : ' (system)'}`;
};

document.querySelector('#toggle')!.addEventListener('click', () => {
  setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
  render();
});
document.querySelector('#reset')!.addEventListener('click', () => {
  clearTheme();
  render();
});
onSystemChange(render);
render();
