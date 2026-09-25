import { defineConfig, devices } from '@playwright/test';

const PORT = 5173;
export const STORAGE_STATE = 'playwright/.auth/user.json';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    // Trace only on retry: full debugging info without slowing every run.
    trace: 'on-first-retry',
  },
  // webServer: Playwright starts the app itself and waits for the URL,
  // so `npx playwright test` works from a cold checkout (and in CI).
  webServer: {
    command: 'npm run dev',
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    // "setup" project logs in once and saves cookies/localStorage to disk.
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
      testIgnore: /auth\.setup\.ts|login\.spec\.ts/,
    },
    {
      // Login tests must start logged OUT, so no storageState here.
      name: 'chromium-anonymous',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /login\.spec\.ts/,
    },
  ],
});
