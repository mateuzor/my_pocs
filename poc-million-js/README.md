# poc-million-js

## What
The same heavy table (thousands of rows) rendered twice: with a plain React
component and with a Million.js `block()` component. A React `<Profiler>`
shows the render time of each so you can compare them.

## Why
React diffs a virtual DOM on every render. Million replaces that diff with a
static template plus direct updates of the dynamic "holes", which cuts the
cost for large, uniform, frequently updated lists.

## How to run
```
npm install
npm run dev
```
Pick 5000+ rows, click "Update all rows" in `plain` mode, then switch to
`block` and repeat. Compare the Profiler ms values (use a production build,
`npm run build && npm run preview`, for fair numbers).

## When it helps / when it doesn't
- Helps: big lists, tables, grids, many similar nodes, frequent updates where
  most of the DOM stays structurally the same.
- Does not help: small trees, components dominated by network or compute,
  logic-heavy components, or code that breaks block rules (impure render,
  conditional hooks, complex children). Then Million bails out or adds overhead.
- Always measure; `auto: true` can also slow things down, so prefer wrapping
  only hot components.

## What to tell a mentor
Million.js is a compiler-assisted optimization, not magic: it trades React's
generality for a faster path on predictable JSX. I measured it with the
React Profiler, saw the gain only on large list updates, and I know the
rules and limits that make block() fall back or not pay off.
