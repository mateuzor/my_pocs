import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Real browser run: includes rules that need layout, e.g. color-contrast.
test('bad page reports violations including contrast', async ({ page }) => {
  await page.goto('/bad.html');
  const results = await new AxeBuilder({ page }).analyze();
  const ids = results.violations.map((v) => v.id);
  expect(ids).toContain('color-contrast');
  expect(ids).toContain('image-alt');
});

test('good page has no WCAG A/AA violations', async ({ page }) => {
  await page.goto('/good.html');
  // Restrict to WCAG tags so the gate matches the compliance target
  // and does not fail on best-practice noise.
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
