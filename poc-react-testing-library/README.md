# poc-react-testing-library

## What
React Testing Library with **Vitest**, **user-event** and **msw**. It tests a login form (validation and submit),
an async user list (loading, success, error through a mocked network), a counter and a custom hook with `renderHook`.

## Why
RTL pushes you to test what the user sees and does, not implementation details. That is why queries are ranked
(role, label, text, test id last) and why `userEvent` is preferred over `fireEvent`. msw mocks at the network
boundary, so the component's real `fetch` code is exercised and tests survive refactors.

## How to run
```
npm install
npm test          # one-off run
npm run test:watch
npm run dev       # the app itself
```

## What to tell a mentor
- Query priority: `getByRole` first; `getByTestId` only as an escape hatch.
- `getBy` (sync, throws), `queryBy` (absence), `findBy` (async, waits).
- `userEvent.setup()` and `await` every interaction.
- msw handlers per test with `server.use`; reset after each test.
- Hooks: `renderHook` + `act`; but prefer testing through components when possible.
