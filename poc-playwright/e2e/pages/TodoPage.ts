import type { Page } from '@playwright/test';

export class TodoPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async add(title: string) {
    await this.page.getByLabel('New todo').fill(title);
    await this.page.getByRole('button', { name: 'Add' }).click();
  }

  async toggle(title: string) {
    await this.page.getByLabel(`Toggle ${title}`).check();
  }

  get items() {
    return this.page.getByRole('list', { name: 'Todo list' }).getByRole('listitem');
  }

  async loadSuggestions() {
    await this.page.getByRole('button', { name: 'Load suggestions' }).click();
  }

  get status() {
    return this.page.getByRole('status');
  }
}
