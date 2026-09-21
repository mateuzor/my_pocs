import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Storybook's react-vite framework reads this file, so the library and its stories share one build setup.
export default defineConfig({
  plugins: [react()],
});
