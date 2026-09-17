# poc-shadcn-radix

## What
Shadcn UI is not a component library you install: it is a set of component files you copy into your repo (`src/components/ui`). Each file wraps an unstyled Radix UI primitive with Tailwind classes, and uses `class-variance-authority` (cva) for variants plus `cn()` (clsx + tailwind-merge) for class composition. This POC hand-writes what the shadcn CLI would generate: Button, Dialog, DropdownMenu, Tabs and Tooltip.

## Why
Radix handles behavior and accessibility (focus management, ARIA roles, keyboard navigation, portals, dismissal). Tailwind handles looks. Because the code lives in your project, you can change anything, with no fighting an opinionated library and no version lock-in. The trade-off is that you own the maintenance.

## How to run
```
npm install
npm run dev
```
Try the demo with the keyboard only: Tab to the controls, open the dialog (Esc closes, focus returns to the trigger), use arrow keys in the menu and tabs, focus the tooltip trigger.

## What to tell a mentor
- Theming uses CSS variables (HSL triplets) mapped in `tailwind.config.js`; a dark theme is just another set of variables.
- `cva` models variants and sizes as data with typed props, and `cn` lets consumers override classes safely.
- `asChild` (Radix `Slot`) merges props onto the child, so you get a link with button styling and valid HTML.
- Radix uses `data-[state=open]`, `data-[highlighted]` and `data-[disabled]` attributes, so styling reacts to state without extra JS.
- Portals avoid z-index and overflow problems; `forwardRef` keeps primitives composable.
