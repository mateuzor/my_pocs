import { defineConfig, devices } from '@playwright/test';

// Playwright runs real browser tests — supports Chromium, Firefox and WebKit.
// Unlike Cypress (Chromium only), Playwright can test across all major engines.
export default defineConfig({
  testDir: './playwright',
  // Run tests in parallel
  fullyParallel: true,
  // Retry failed tests once in CI
  retries: process.env.CI ? 1 : 0,
  use: {
    // Base URL so tests can use relative paths: page.goto('/')
    baseURL: 'http://localhost:5173',
    // Record a trace on the first retry — useful for debugging failures
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  // Automatically start the dev server before running tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
