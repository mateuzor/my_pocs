import { defineConfig } from 'cypress';

export default defineConfig({
  // E2E config — Cypress runs tests in a real browser against the live dev server
  e2e: {
    baseUrl: 'http://localhost:5173',
    // Where the test specs live
    specPattern: 'cypress/e2e/**/*.cy.{ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    // Cypress takes screenshots on failure by default — keep them in source control
    // for debugging flaky tests in CI
    screenshotOnRunFailure: true,
    video: false, // disable video recording for speed in local dev
  },
});
