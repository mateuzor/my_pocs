# 🌍 POC 8: Internationalization (i18n) in Vanilla JavaScript

This POC demonstrates how to implement **internationalization (i18n)** in a frontend application using **pure HTML, CSS, and JavaScript**, without relying on any external libraries.

---

## 🎯 Goal

Create a multilingual interface that supports switching languages dynamically using JSON translation files and simple DOM updates.

---

## 📁 Project Structure

```
/poc-i18n
│── /src
│   ├── index.html         # HTML with data-i18n attributes for translation
│   ├── app.js             # JS logic to load and apply translations
│   ├── styles.css         # Simple layout and styling
│   └── /lang              # JSON files with translations
│       ├── en.json
│       ├── pt.json
│       └── es.json
```

---

## 🚀 How to Run Locally

1. Open a terminal in the `src/` folder:

```bash
npx http-server -p 3000
```

2. Open in browser: [http://localhost:3000](http://localhost:3000)

---

## 💬 How It Works

### 🔄 HTML Elements:

The HTML contains elements marked with `data-i18n` attributes:

```html
<h1 data-i18n="title"></h1>
<p data-i18n="description"></p>
<button data-i18n="button_label"></button>
```

These are dynamically updated based on the selected language.

---

### 🌐 Language Switcher:

```html
<select id="language-switcher">
  <option value="en">EN</option>
  <option value="pt">PT</option>
  <option value="es">ES</option>
</select>
```

This dropdown allows switching between English, Portuguese, and Spanish.

---

### 📜 Translation Files:

Each language file (e.g. `en.json`) contains key-value pairs:

```json
{
  "title": "Welcome",
  "description": "This is a multilingual PWA example.",
  "button_label": "Click Me"
}
```

---

### 🧠 JavaScript Logic (app.js):

```js
async function loadLanguage(lang) {
  const res = await fetch(`lang/${lang}.json`);
  const translations = await res.json();

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.textContent = translations[key] || key;
  });
}
```

- Loads the selected language file
- Updates all DOM elements with matching `data-i18n` keys

```js
window.addEventListener("DOMContentLoaded", () => {
  loadLanguage("en"); // Default language
});
```

```js
document.getElementById("language-switcher").addEventListener("change", (e) => {
  loadLanguage(e.target.value);
});
```

- Allows dynamic switching when the dropdown changes

---

## ✅ Features

- No dependencies (pure JS, HTML, CSS)
- JSON-based language files
- Live language switching
- Easy to extend to more languages or keys

---

## 🧪 Ideas for Expansion

- Save selected language in localStorage
- Automatically detect browser language
- Add pluralization support
- Integrate into a larger PWA or SPA

---
