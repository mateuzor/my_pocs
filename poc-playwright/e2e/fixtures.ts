import { test as base } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { TodoPage } from './pages/TodoPage';

// Custom fixtures: Playwright builds them lazily per test, so specs just
// destructure `{ todoPage }` with no beforeEach boilerplate or shared state.
export const test = base.extend<{ loginPage: LoginPage; todoPage: TodoPage }>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await use(todoPage);
  },
});

export { expect } from '@playwright/test';
