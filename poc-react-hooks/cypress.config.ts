import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // baseUrl is prepended to cy.visit() calls — matches the Vite dev server
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
  },
});
