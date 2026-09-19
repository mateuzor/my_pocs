# poc-custom-eslint

## What
A custom ESLint setup using the **flat config** (`eslint.config.js`) and a **local plugin** with two rules:
`no-magic-timeout` (reports numeric delays in `setTimeout`/`setInterval`, offers a *suggestion*) and
`no-hardcoded-url` (reports remote URLs in string literals, offers an *autofix*). Both are covered by `RuleTester` tests.

## Why
Linters enforce team conventions that no generic rule covers. A rule is a function that returns visitors for AST node types;
it reports problems with `messageId`s, and may attach fixes (safe, automatic) or suggestions (need human choice).
In flat config a plugin is just an imported object, so local rules need no publishing.

## How to run
```
npm install
npm run lint       # see the violations in sample/
npm run lint:fix   # applies the URL autofix
npm test           # RuleTester via node:test
```

## What to tell a mentor
- Flat config is an array of objects; plugins are imported values, not strings.
- A rule = `meta` (schema, messages, fixable) + `create(context)` returning AST visitors.
- Fix vs suggestion: fix when deterministic, suggestion when it needs intent.
- `RuleTester` with valid/invalid cases is the spec; I assert on `messageId`, not text.
