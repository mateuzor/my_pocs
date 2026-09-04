# poc-clamp-typography

## What
Responsive typography using CSS `clamp(min, preferred, max)`. A modular type scale (step -1 to 5) is defined as CSS custom properties, each step fluidly interpolating between a small-screen and a large-screen size.

## Why
Media-query breakpoints make type jump abruptly and multiply CSS. `clamp()` gives continuous scaling, bounded at both ends, in one declaration. Using `rem` for the bounds keeps respecting user font preferences; a pure `vw` size would break zoom accessibility.

## How to run
```
npm install
npm run dev
```
Resize the window; the list shows each step's computed pixel size.

## What to tell a mentor
- `clamp(min, intercept + slope*vw, max)` is just a linear interpolation with guard rails.
- Tokens live in `tokens.css`, so the scale is changed in one place.
- Mix `rem` and `vw` in the preferred value so browser zoom still works.
- Tools like utopia.fyi generate the numbers.
