# poc-web-components

## What
Web Components are four browser standards: Custom Elements (your own tags), Shadow DOM (encapsulated DOM and CSS), HTML templates, and slots. This POC builds three vanilla TypeScript components with Vite: `ui-badge`, `ui-card` (named slots and CSS parts) and `ui-counter` (attributes, properties, events).

## Why
They are framework-agnostic: the same `<ui-card>` works in React, Vue, Angular or plain HTML. This makes them a good fit for design systems shared across stacks. The cost is more boilerplate than a framework and manual reactivity (libraries like Lit remove most of that).

## How to run
```
npm install
npm run dev
```

## What to tell a mentor
- Shadow DOM isolates styles both ways. Theming is done deliberately via CSS custom properties (which inherit) and `::part()` (which exposes selected elements).
- Slots project light DOM children into the shadow tree. Named slots give layout regions, and `slotchange` lets the component react to its children.
- Attributes are strings and properties are typed values. `observedAttributes` plus `attributeChangedCallback` sync HTML to JS, and setters reflect back.
- Output goes through `CustomEvent` with `composed: true` so it crosses the shadow boundary.
- Cloning a `<template>` is cheaper than re-parsing HTML for every instance.
