import { test, expect } from './fixtures';

// Network mocking: the backend does not even exist here. page.route lets us
// make API responses deterministic and also simulate failures that are hard
// to trigger against a real server.
test('renders suggestions from a mocked API', async ({ page, todoPage }) => {
  await page.route('**/api/suggestions', (route) =>
    route.fulfill({ json: ['Mocked A', 'Mocked B'] }),
  );
  await todoPage.loadSuggestions();
  await expect(todoPage.items).toHaveText(['Mocked A', 'Mocked B']);
});

test('shows an error when the API fails', async ({ page, todoPage }) => {
  await page.route('**/api/suggestions', (route) => route.fulfill({ status: 500 }));
  await todoPage.loadSuggestions();
  await expect(todoPage.status).toHaveText('Could not load suggestions');
});
