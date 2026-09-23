# poc-storybook

## What
Storybook 8 (React + Vite) for a small component library: `Button`, `TextField`, `Badge`, `Card`.
It uses CSF3 stories, **controls and argTypes**, default `args`, **play functions** for interaction tests,
decorators (global and per-story), a theme toolbar via `globalTypes`, autodocs plus an MDX page, and the **a11y addon** (axe-core).
Config is hand-written in `.storybook/`.

## Why
Storybook develops and documents components in isolation, so every state is reachable without wiring the full app.
Stories double as living documentation, visual-regression targets and (with `play`) interaction tests.
The a11y addon catches accessibility issues early, right where the component is built.

## How to run
```
npm install
npm run storybook        # http://localhost:6006
npm run build-storybook  # static site
```

## What to tell a mentor
- A story is a function of `args`; controls are generated from TS props, and `argTypes` refine them.
- Decorators wrap stories (providers, theme, layout); global ones live in `preview.tsx`.
- `play` functions simulate users with `@storybook/test`, so the story is also a test.
- The a11y addon runs axe on each story; set `test: 'error'` in CI to enforce it.
- `tags: ['autodocs']` builds the docs page from props and JSDoc.
