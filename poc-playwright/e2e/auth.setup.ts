import { test as setup, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { STORAGE_STATE } from '../playwright.config';

// Auth state reuse: log in ONCE through the UI, dump storage to a file, and
// let every other project start already authenticated. Saves seconds per test.
setup('authenticate', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('demo', 'demo');
  await expect(page.getByRole('heading', { name: 'My todos' })).toBeVisible();
  await page.context().storageState({ path: STORAGE_STATE });
});
