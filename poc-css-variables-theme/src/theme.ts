export type Theme = 'light' | 'dark';
const KEY = 'theme';
const media = window.matchMedia('(prefers-color-scheme: dark)');

// The effective theme is the saved choice, or the OS preference as fallback.
export function currentTheme(): Theme {
  const saved = localStorage.getItem(KEY) as Theme | null;
  return saved ?? (media.matches ? 'dark' : 'light');
}

export function setTheme(theme: Theme) {
  localStorage.setItem(KEY, theme);
  document.documentElement.dataset.theme = theme;
}

export function clearTheme() {
  localStorage.removeItem(KEY);
  delete document.documentElement.dataset.theme;
}

// Re-run a callback when the OS preference changes (only matters when no saved choice).
export function onSystemChange(cb: () => void) {
  media.addEventListener('change', cb);
}
