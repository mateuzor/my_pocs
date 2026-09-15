import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  // Same "@/..." alias as tsconfig paths: shadcn-generated files import from "@/lib/utils".
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
});
