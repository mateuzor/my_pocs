import { test, expect } from './fixtures';

test('rejects wrong credentials', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.login('demo', 'wrong');
  await expect(loginPage.error).toHaveText('Invalid credentials');
});
