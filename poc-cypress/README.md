# Cypress POC

End-to-end testing with Cypress 13. A small React app + a spec demonstrating
the most common patterns: typing, clicking, asserting DOM state, and stubbing
network requests.

## Run

```bash
npm install

# Interactive runner — opens the Cypress UI
npm run dev          # in one terminal: starts Vite dev server on 5173
npm run cy:open      # in another: launches the Cypress runner

# Or run headless once:
npm run test:e2e     # starts the server, runs all specs, shuts down
```

## What's covered

- **DOM selection** via `data-cy` attributes (stable across refactors).
- **User interactions**: `cy.type()`, `cy.click()`, `cy.check()`.
- **Assertions** with `.should()` — auto-retries until satisfied or timeout.
- **Scoped queries** with `cy.within()`.
- **Network stubbing** with `cy.intercept()` — testing both happy path and
  error response.
- **Wait for requests** with aliases (`@getUser`) and `cy.wait()`.

## Cypress vs Playwright vs RTL

| Aspect | Cypress | Playwright | React Testing Library |
|---|---|---|---|
| Where tests run | In the browser | Driven from Node | In jsdom (no real browser) |
| Speed | Medium | Fast | Very fast |
| Debugging | Best-in-class UI with snapshots | DevTools-style trace viewer | Console only |
| Network stubbing | `cy.intercept()` | `page.route()` | `msw` |
| Multi-tab/origin | Limited | First-class | N/A |
| Test type | E2E + component | E2E + component | Component / unit |

**Rule of thumb:**

- **RTL** for component-level: rendering, props, events. Fast feedback loop.
- **Cypress** when you need a real browser, full-page flows, and the best
  debugging UX.
- **Playwright** when you need multi-tab, multi-origin, or parallel
  cross-browser CI runs.
