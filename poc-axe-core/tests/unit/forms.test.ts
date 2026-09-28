import { axe, toHaveNoViolations } from 'jest-axe';
import { renderBad, renderGood } from '../../src/forms';

// jest-axe works in vitest too: we only need to register its matcher.
expect.extend(toHaveNoViolations);

function mount(html: string) {
  const root = document.createElement('div');
  root.innerHTML = html;
  document.body.appendChild(root);
  return root;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('signup form accessibility (jsdom)', () => {
  it('bad version has violations', async () => {
    const results = await axe(mount(renderBad()));
    const ids = results.violations.map((v) => v.id);
    // Asserting concrete rule ids documents WHY it fails, not just that it fails.
    expect(ids).toEqual(expect.arrayContaining(['image-alt', 'label', 'link-name']));
  });

  it('good version has no violations', async () => {
    // Note: jsdom has no layout engine, so axe skips color-contrast here.
    // That rule is covered by the real-browser Playwright test.
    expect(await axe(mount(renderGood()))).toHaveNoViolations();
  });
});
