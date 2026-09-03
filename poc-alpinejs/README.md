# poc-alpinejs

## What
Alpine.js is a tiny (~15kb) library that adds reactivity directly to HTML through attributes: `x-data`, `x-show`, `x-for`, `x-model`, `x-text`, `@click`, `x-transition`. This POC shows a toggle with transition, a todo list, and global stores.

## Why
When you need interactivity on server-rendered or static pages, a full SPA framework is overkill. Alpine gives "Vue-like" declarative behaviour with no build step required (here Vite is only used for TypeScript and bundling convenience).

## How to run
```
npm install
npm run dev
```

## What to tell a mentor
- State lives in `x-data` scopes; shared state goes in `Alpine.store`.
- `Alpine.data` extracts component logic from HTML so it is typed and reusable.
- `x-for` requires `<template>` and a `:key`, like keys in React lists.
- Trade-off: great for sprinkles of interactivity, not for large app architecture (no routing, limited tooling).
