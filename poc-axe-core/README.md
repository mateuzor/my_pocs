# poc-axe-core

## What
Automated accessibility testing with axe-core. The same signup form exists twice: `bad.html` (missing labels, alt text, link name, poor contrast, clickable `div`) and `good.html` (fixed). Tests run axe through `jest-axe` on vitest/jsdom and through `@axe-core/playwright` in a real browser.

## Why
Automated rules catch roughly a third of WCAG issues cheaply and prevent regressions in CI. jsdom tests are fast but cannot compute layout, so `color-contrast` only works in the browser run. Using both gives speed plus coverage. Automation never replaces manual testing with a screen reader.

## How to run
```bash
npm install
npx playwright install chromium
npm test            # vitest + jest-axe
npm run test:e2e    # Playwright + axe
npm run dev         # open /bad.html and /good.html
```

## What to tell a mentor
- Assert on rule ids for known-bad pages and on zero violations for good pages.
- Scope the gate with `withTags` to the WCAG level you promise.
- Passing axe does not mean accessible: keyboard flow, focus order, and screen reader wording need manual checks.

## Manual checklist: VoiceOver on Safari (macOS)
Start with Cmd+F5. VO key is Ctrl+Option.
1. Page title is announced on load and describes the page.
2. VO+U opens the rotor: check Headings, Landmarks, Links, and Form Controls lists make sense and have no empty entries.
3. Tab through the form: every field announces its label, type, and state (for example "Email, edit text").
4. Images announce meaningful alt text; decorative images are skipped.
5. Buttons announce as "button", links as "link", with distinct names out of context.
6. Submit with errors: the error message is announced (live region or focus moved to it).
7. Everything is operable with keyboard only; focus is always visible and never trapped.
8. Zoom to 200% and check nothing is cut off or overlapping.
9. In Safari, enable Tab to highlight each item (Settings > Advanced) so Tab reaches links and buttons like other browsers.
