# 🧰 POC 9: JavaScript Utility Library (Strings, Dates & Numbers)

This POC demonstrates how to build a modular **JavaScript utility library** with reusable functions for **string, date, and number** manipulation, using pure JavaScript with ES Modules.

---

## 📁 Project Structure

```
/poc-utils
│── /src
│   ├── index.html         # Simple UI to test functions
│   ├── main.js            # Connects utils to the UI
│   └── /utils
│       ├── strings.js     # String utility functions
│       ├── dates.js       # Date utility functions
│       └── numbers.js     # Number utility functions
```

---

## 🚀 How to Run Locally

1. Open a terminal in the `src/` folder:

```bash
npx http-server -p 3000
```

2. Open in browser:
   [http://localhost:3000](http://localhost:3000)

3. Click the **"Run"** button to see test outputs.

---

## 🧠 Utility Functions

### 📌 strings.js

```js
capitalize("hello world") → "Hello world"
kebabCase("Hello World") → "hello-world"
```

### 📆 dates.js

```js
formatDate("2024-12-25") → "12/25/2024" (locale-based)
daysBetween("2024-01-01", "2024-01-10") → 9
```

### 🔢 numbers.js

```js
formatCurrency(1234.5) → "$1,234.50"
round(3.14159, 2) → 3.14
```

All functions are exported individually, enabling tree-shaking or selective imports if needed.

---

## 🧪 Test Integration

The `main.js` file imports all utilities and binds them to the browser:

```js
window.runTests = () => {
  /* run all functions and show results */
};
```

The button in the UI triggers this function and displays the output in a `<pre>` block.

---

## ✅ Features

- Organized modular structure
- Pure JavaScript (ES Modules)
- Built-in browser APIs only (no dependencies)
- Easy to extend (add more utils per domain)

---

## 💡 Ideas for Expansion

- Add string utils: `camelCase`, `snakeCase`, `truncate`
- Add date utils: `addDays`, `getWeekday`, `isWeekend`
- Add number utils: `random`, `clamp`, `toFixedDecimal`

---
