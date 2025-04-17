# 🌀 My Own TailwindCSS

A Proof of Concept to build a simplified, custom version of TailwindCSS from scratch, focusing on learning and having full control over utility classes.

This project simulates Tailwind-like utility behavior using pure CSS, combined with a live reload setup using `chokidar` and `socket.io` for a smoother development workflow.

---

## 🚀 Features

- 📆 Utility-first styling (e.g., `bg-primary`, `p-2`, `text-light`, etc.)
- 🔁 Automatic live reload on changes inside `src/`
- 🥪 Type definitions (`tailwind.d.ts`) for use in TypeScript projects
- ⚙️ Lightweight build system (just copies files to `dist`)
- 🌐 Express server with socket-based hot reloading

---

## 📂 Project Structure

```
tailspin/
├── dist/                    # Built files (copied from src)
├── src/
│   ├── index.html           # Example HTML using the utility classes
│   ├── styles/
│   │   └── tailwind.css     # Custom utility class definitions
│   └── tailwind.d.ts        # TypeScript declarations for utility classes
├── server.js                # Express server with file watcher and socket
├── package.json             # Dependencies and scripts
```

---

## ⚙️ Getting Started

### 1. Install dependencies:

```bash
npm install
```

### 2. Start the dev server with live reload:

```bash
node server.js
```

> Visit: [http://localhost:3000](http://localhost:3000)

### 3. Manually build assets:

```bash
npm run build
```

---

## 💡 How it Works

- The Express server serves static files from the `dist/` folder.
- `chokidar` watches changes in the `src/` directory and triggers `npm run build` on changes.
- `socket.io` notifies the browser to reload the page when the build is complete.

---

## ✨ Available Utilities

### 🎨 Colors

```html
<div class="bg-primary text-light">Primary</div>
<div class="bg-secondary text-light">Secondary</div>
<div class="bg-success text-light">Success</div>
<div class="bg-info text-light">Info</div>
<div class="bg-warning text-dark">Warning</div>
<div class="bg-danger text-light">Danger</div>
<div class="bg-light text-dark">Light</div>
<div class="bg-dark text-light">Dark</div>
```

### 📏 Spacing

- **Margins:** `m-1` to `m-5`
- **Padding:** `p-1` to `p-3`

---

## 🔧 Scripts

| Script           | Description                                    |
| ---------------- | ---------------------------------------------- |
| `npm start`      | Starts `lite-server` (not used in this setup)  |
| `npm run build`  | Copies files from `src/` to `dist/`            |
| `node server.js` | Starts the Express dev server with live reload |

---

## 🧠 Motivation

This project was created as a learning exercise to understand:

- How utility-based CSS frameworks like Tailwind work under the hood
- How to implement a lightweight hot reload setup with Node.js
- How to structure a minimal yet reusable design system

---
