import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',       // simulate a browser DOM environment in Node
    setupFiles: ['./src/test/setup.ts'],
    globals: true,              // makes describe/it/expect available without imports
  },
})
