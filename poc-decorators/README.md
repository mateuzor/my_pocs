# poc-decorators

## What
Modern TC39 (stage 3) decorators as implemented in TypeScript 5: class, method, field and accessor decorators. Examples: `@log`, `@memoize`, `@bound`, `@range` (validation), `@upper`, `@sealed`.

## Why
Decorators let you attach cross-cutting behaviour (logging, caching, validation) declaratively, without changing the decorated code. The new standard differs from the old `experimentalDecorators`: a typed `context` object, no parameter decorators, and `accessor` keyword for fields that need get/set interception.

## How to run
```
npm install
npm run dev
```
Check the page output and the console. Do not enable `experimentalDecorators` in tsconfig.

## What to tell a mentor
- A decorator is a function `(value, context) => replacement | void`.
- `context.kind` tells what is being decorated; `addInitializer` hooks into construction.
- `@memoize` and `@log` wrap methods; `@range` uses `accessor` to validate every write.
- Old and new decorators are incompatible (Angular/NestJS still use the legacy ones).
