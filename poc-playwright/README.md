# poc-playwright

## What
End-to-end testing with Playwright against a tiny Vite app (login, todo list, remote suggestions). It shows the patterns that keep E2E suites maintainable: `webServer`, page objects, custom fixtures, auth state reuse, network mocking and visual snapshots.

## Why
E2E tests are slow and flaky when each test logs in through the UI, hard-codes selectors, or hits a real backend. Playwright's auto-waiting assertions, a setup project that saves `storageState`, and `page.route` mocks remove most of that pain. Page objects centralize selectors, and fixtures inject them without boilerplate.

## How to run
```bash
npm install
npx playwright install chromium
npm run test:e2e        # starts the dev server automatically
npm run test:ui         # interactive UI mode
npm run test:update     # refresh visual baselines
```

## What to tell a mentor
- `webServer` in `playwright.config.ts` boots the app, so CI needs only one command.
- A `setup` project logs in once; the other projects depend on it and reuse `playwright/.auth/user.json`. Login specs use a separate project without that state.
- Locators are role/label based (`getByRole`, `getByLabel`), which tests accessibility and resists markup changes.
- `page.route` makes API tests deterministic and lets me simulate a 500 easily.
- Screenshot tests need a stable environment (same OS/fonts), so baselines should be generated in CI or Docker.
