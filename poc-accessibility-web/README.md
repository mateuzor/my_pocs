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

### Sample test output:

```txt
PASS  src/__tests__/accessibility.test.jsx
✓ should have no accessibility violations
```

If you break accessibility (e.g., remove an `aria-label` or use incorrect structure), the test will fail and point to the violated rule.

---

## 📊 Linting with ESLint + `jsx-a11y`

- The ESLint configuration uses **Flat Config** format
- Plugin: `eslint-plugin-jsx-a11y`
- Rules: All major WCAG/ARIA rules enabled

You can find the config in: `eslint.config.mjs`

```bash
yarn lint
```

> All non-interactive `tabIndex`, redundant roles, ARIA misuse, label associations, etc. are enforced.

---

## 🧑‍💻 Keyboard & VoiceOver Testing

### VoiceOver

- macOS: `Cmd + F5` to toggle VoiceOver
- Navigate using arrow keys or `Tab`

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

### Footer

- `role="contentinfo"`, placed outside of `<main>`

---

## ✅ Lighthouse Audit Tips

1. Open Chrome DevTools
2. Go to "Lighthouse"
3. Select only "Accessibility"
4. Click "Analyze page load"
5. You should get **100% score** if everything is correct

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

---
