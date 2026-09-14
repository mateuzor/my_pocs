import '../build/css/variables.css';
import '../build/css/theme-dark.css';
import './style.css';
// The same tokens are also available as a JS module (useful for charts, canvas, tests).
import { ColorPaletteIndigo500, ColorPaletteIndigo600, ColorPaletteIndigo100, ColorFeedbackDanger } from '../build/js/tokens.js';

document.getElementById('theme').addEventListener('click', () => {
  const root = document.documentElement;
  // The dark file only redefines variables under [data-theme="dark"], so toggling one attribute re-themes the page.
  root.dataset.theme = root.dataset.theme === 'dark' ? '' : 'dark';
});

const colors = { ColorPaletteIndigo500, ColorPaletteIndigo600, ColorPaletteIndigo100, ColorFeedbackDanger };
document.getElementById('swatches').innerHTML = Object.entries(colors)
  .map(([name, hex]) => `<span class="swatch" style="background:${hex}">${name}<br>${hex}</span>`)
  .join('');
