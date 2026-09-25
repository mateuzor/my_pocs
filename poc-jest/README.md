# poc-jest

## What
Unit tests in TypeScript with **Jest + ts-jest** over a tiny shopping domain (`Cart`, `pricing`, `debounce/retry`, `checkout`).
It covers matchers, `jest.fn`/`spyOn`, dependency injection for mocks, async assertions, fake timers, inline snapshots,
`it.each`, and **coverage thresholds** that fail the run when coverage drops.

## Why
Fast, isolated unit tests give quick feedback and a safety net for refactoring. Good tests control their inputs
(mocks, fake timers), assert on behaviour, and stay independent (`beforeEach`, `clearMocks`).

## How to run
```
npm install
npm test
npm run test:coverage   # enforces thresholds from jest.config.js
```

## What to tell a mentor
- `toBe` vs `toEqual` vs `toMatchObject`; `toBeCloseTo` for floats.
- Inject collaborators so mocks are trivial; `spyOn` for real methods, and always restore.
- Fake timers remove real waiting; use the async variants with promises.
- Snapshots are for stable output only; review their diffs.
- Coverage thresholds are a gate, not a goal: they do not prove the assertions are good.
