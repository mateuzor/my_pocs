# Accessible Web POC

This project is a highly optimized React-based proof of concept (POC) designed to showcase and validate modern web accessibility (a11y) practices. It demonstrates how to build a fully accessible frontend interface with a focus on WCAG 2.1 standards, Apple VoiceOver support, Lighthouse audits, ESLint rules, and automated testing using jest-axe.

---

## 📦 Features

- **Semantic HTML structure** with proper landmark usage
- **Keyboard navigation support** (`Skip to content`, modals, buttons)
- **Accessible forms** with labels and ARIA attributes
- **Responsive and screen reader-friendly modal**
- **Accessible tables** with captions and column scopes
- **Decorative image usage** with descriptive `alt` and `figcaption`
- **Lighthouse 100% accessibility score ready**
- **VoiceOver tested**
- **Linted with `eslint-plugin-jsx-a11y` (Flat config)**
- **Automated tests using `jest-axe`**
- **WCAG 2.1 AA coverage across tests, lint and structure**

---

## 🛠️ Getting Started

### 1. Install dependencies

```bash
yarn install
```

### 2. Run development server

```bash
yarn start
```

### 3. Lint the project

```bash
yarn lint
```

### 4. Run accessibility tests

```bash
yarn test:accessibility
```

---

## 🧪 Accessibility Tests with `jest-axe`

This project includes automated tests that validate the rendered HTML against accessibility rules from [axe-core](https://github.com/dequelabs/axe-core).

### ✅ What does `jest-axe` do?

- It uses the **axe-core** engine to scan your rendered React components
- It outputs detailed reports on violations, WCAG tags, element paths and suggested fixes
- It's great for CI validation and regression testing

### 🔍 Real-world use cases

- Prevent regressions when modifying UI components
- Test themes, layouts or modal behavior for screen readers
- Validate CMS content rendering consistently follows accessibility guidelines

### 🧩 Customizing axe

You can configure the behavior using `axe()` options:

```js
axe(container, {
  rules: {
    "color-contrast": { enabled: false },
    region: { enabled: true },
  },
});
```

### Use Cases for Custom Options:

- **Disable contrast** if testing during theming (e.g., dark mode)
- **Ignore specific violations** if you're mid-refactor
- **Target only parts of the DOM** (e.g., just inside `<main>`, excluding nav/header/footer)

### Sample test output:

```txt
PASS  src/__tests__/accessibility.test.jsx
✓ should have no accessibility violations
```

If you break accessibility (e.g., remove an `aria-label` or use incorrect structure), the test will fail and point to the violated rule with a direct link to documentation.

---

## 📊 Linting with ESLint + `jsx-a11y`

- The ESLint configuration uses **Flat Config** format
- Plugin: `eslint-plugin-jsx-a11y`
- Rules: All major WCAG/ARIA rules enabled and enforced

You can find the config in: `eslint.config.mjs`

```bash
yarn lint
```

> Examples of enforced rules:
>
> - No `tabIndex` on non-interactive elements
> - All `<img>` must have an `alt` prop
> - `<label>` must be associated with a control
> - All landmarks must not be nested improperly

---

## 🧑‍💻 Keyboard & VoiceOver Testing

### VoiceOver

- macOS: `Cmd + F5` to toggle VoiceOver
- Navigate using arrow keys or `Tab`
- Test reading order, announcements, focus behavior

### Keyboard

- `Tab` to navigate between focusable elements
- `Enter` or `Space` to activate buttons
- Skip link (`Tab` from top): "Skip to main content"
- Modal: opens with focus, closes with button

---

## 📋 Components Breakdown

### Header

- `role="banner"`
- Navigation with `aria-label="Main navigation"`

### Main

- Email form with labels, `aria-required`, and validation
- Table with semantic headings and caption
- Buttons with readable actions and ARIA dialog trigger

### Modal

- `role="dialog"`, `aria-modal`, and focus trapping on open
- Focus returned after close via `ref`

### Footer

- `role="contentinfo"`, placed outside of `<main>`

---

## ✅ Lighthouse Audit Tips

1. Open Chrome DevTools
2. Go to "Lighthouse"
3. Select only "Accessibility"
4. Click "Analyze page load"
5. You should get **100% score** if everything is correct

---

## 📁 Folder Structure

```
src/
├── App.jsx
├── App.css
├── index.jsx
├── __tests__/
│   └── accessibility.test.jsx
```

---

## 🙌 Acknowledgements

- [Deque axe-core](https://www.deque.com/axe/)
- [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)
- [Apple VoiceOver documentation](https://support.apple.com/guide/voiceover/welcome/mac)
- [W3C WCAG 2.1](https://www.w3.org/TR/WCAG21/)
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Learn/Accessibility)

---
