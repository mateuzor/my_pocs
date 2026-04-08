import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

// useTheme wraps useContext(ThemeContext) — consumers do not need to
// import ThemeContext directly, just this hook
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return context;
}
