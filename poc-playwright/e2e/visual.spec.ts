import { test, expect } from './fixtures';

// Visual snapshot: first run stores a baseline PNG next to the spec; later
// runs diff against it. Update intentionally with `npm run test:update`.
test('empty todo list looks the same', async ({ page, todoPage }) => {
  await expect(page).toHaveScreenshot('empty-list.png', { maxDiffPixelRatio: 0.01 });
  await todoPage.add('Snapshot me');
  await expect(page.getByRole('list', { name: 'Todo list' })).toHaveScreenshot('one-item.png');
});
