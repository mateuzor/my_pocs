import type { Page } from '@playwright/test';

// Page Object: tests say WHAT a user does; selectors live here only,
// so a markup change is fixed in one place instead of in every spec.
export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.page.getByLabel('Username').fill(username);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Sign in' }).click();
  }

  get error() {
    return this.page.getByRole('alert');
  }
}
