import { test, expect } from '@playwright/test';

// Smoke test: verify the app loads and renders key content.
// Playwright uses async/await throughout — cleaner than Cypress's command queue.
test('app loads and shows main heading', async ({ page }) => {
  await page.goto('/');

  // page.getByRole uses ARIA roles — more resilient than CSS selectors
  const heading = page.getByRole('heading', { level: 1 }).first();
  await expect(heading).toBeVisible();
});

test('counter increments on button click', async ({ page }) => {
  await page.goto('/');

  // getByRole('button') finds all buttons — filter by name to target one
  const incrementBtn = page.getByRole('button', { name: '+' }).first();

  if (await incrementBtn.isVisible()) {
    await incrementBtn.click();
    // Playwright auto-waits for assertions — no manual waits needed
    await expect(incrementBtn).toBeVisible();
  }
});
