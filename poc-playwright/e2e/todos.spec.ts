import { test, expect } from './fixtures';

test('adds and completes a todo', async ({ todoPage }) => {
  await todoPage.add('Write E2E tests');
  await expect(todoPage.items).toHaveCount(1);
  await todoPage.toggle('Write E2E tests');
  // Web-first assertion: auto-retries until true, no manual sleeps.
  await expect(todoPage.items.first()).toHaveClass(/done/);
});

test('starts authenticated thanks to the saved storage state', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();
});
