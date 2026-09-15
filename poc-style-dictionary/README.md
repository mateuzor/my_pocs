# poc-style-dictionary

## What
Design tokens are named design decisions (colors, spacing, type) stored as data. Style Dictionary v4 reads token JSON (DTCG `$value`/`$type` syntax) and generates platform files: CSS custom properties, a JS module with TS declarations, an iOS Swift class and Android XML resources.

## Why
Design and engineering share one source of truth. Change `color.palette.indigo.500` once and web, iOS and Android all update on the next build, with no drift between Figma and code.

## How to run
```
npm install
npm run dev        # builds tokens, then starts the demo page
npm run build:tokens
```
Generated files appear in `build/` (css, js, ios, android, json). They are generated, so they are git-ignored.

## What to tell a mentor
- Tokens have layers: primitives (`palette.indigo.500`) and semantic aliases (`action.primary`) that reference them with `{...}`. Components use only semantic tokens.
- `config.js` declares platforms, each with a transform group (what happens to values and names) and files (format and filter).
- `outputReferences` emits `var(--x)` in CSS so overrides cascade.
- Theming: the dark file only overrides semantic tokens and is emitted under `[data-theme="dark"]`.
- It is extensible: `build.js` registers a custom format and a custom transform.
