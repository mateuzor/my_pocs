# poc-css-variables-theme

## What
Dark/light theming driven by CSS custom properties. Defaults to `prefers-color-scheme`, lets the user override via a toggle, and persists the choice in `localStorage` through a `data-theme` attribute on `<html>`.

## Why
Tokens as variables mean components never know about themes: swapping a handful of values re-skins everything, with no JS style manipulation and no duplicated CSS. Respecting the OS preference is good UX; the override gives user control.

## How to run
```
npm install
npm run dev
```
Change your OS appearance to see it follow; click the toggle to override; "Use system" resets.

## What to tell a mentor
- Selector precedence: `[data-theme]` beats the `prefers-color-scheme` media query via `:not([data-theme])`.
- A tiny inline script in `<head>` sets the attribute before paint to avoid a flash of the wrong theme.
- `color-scheme` makes native controls and scrollbars match.
