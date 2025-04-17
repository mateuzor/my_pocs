# 👀 Intersection Observer Lazy Load POC

A simple and efficient Proof of Concept showcasing how to use the **Intersection Observer API** to lazily load Pokémon images from the [PokéAPI](https://pokeapi.co/).

Built with **Vite**, **React**, and **Axios**, this project demonstrates how to detect when elements enter the viewport and defer loading of heavy assets (like images) until they're actually visible.

---

## 🚀 Features

- 🐢 Lazy loads Pokémon images only when they enter the viewport
- 📡 Fetches a large list of Pokémon from PokéAPI
- 🔍 Uses native Intersection Observer API
- ⚛️ Built with React and functional hooks
- ⚡️ Fast dev environment powered by Vite

---

## 📁 Project Structure

```
intersection-observer-poc/
├── index.html                  # HTML entry point
├── src/
│   ├── App.jsx                # Main app logic
│   ├── main.jsx               # React/Vite entry point
│   ├── App.css                # Basic styling
│   ├── components/
│   │   └── LazyComponent.jsx  # React component with Intersection Observer
│   └── IntersectionObserver/
│       └── Observer.js        # Shared IntersectionObserver instance
```

---

## 🛠️ Getting Started

1. **Install dependencies**:

```bash
npm install
```

2. **Start development server**:

```bash
npm run dev
```

> App runs on: [http://localhost:5173](http://localhost:5173)

---

## ⚙️ How It Works

### `Observer.js`

Creates a shared instance of the Intersection Observer and defines what to do when observed elements enter the viewport:

- If the image is intersecting, the actual image URL is set from `data-src`
- The image is then unobserved to prevent further unnecessary observation

### `LazyComponent.jsx`

A lightweight component that attaches the Intersection Observer to an `<img>` element using a `ref` and `useEffect`.

### `App.jsx`

Fetches a list of Pokémon using Axios and maps over them to render headings and lazy-loaded images using `LazyComponent`.

### Example

---

## 📦 API Used

- [PokéAPI](https://pokeapi.co/): Retrieves Pokémon names and sprite image IDs

---

## 🧠 Motivation

This POC was created to:

- Learn how to implement Intersection Observer in a real React app
- Optimize performance by deferring image loads
- Understand how native browser APIs work with React hooks

---
