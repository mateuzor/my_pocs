# Debounce vs Throttle - POC in React

This is a Proof of Concept (POC) built with React that demonstrates the difference between `debounce` and `throttle`, using pure JavaScript implementations with no external libraries.

## 📌 Concepts

### 🔁 Debounce

- **Definition:** Delays the execution of a function until the user stops triggering the action for a specified period.
- **Use case:** Ideal for search inputs, autocomplete, window `resize` events, or user typing.

### ⏱️ Throttle

- **Definition:** Ensures a function is executed at most once every specified number of milliseconds.
- **Use case:** Ideal for continuous events like `scroll`, `resize`, or `mousemove`.

## 🚀 How to use

```bash
npm install
npm run dev
```

## 🧪 What this POC demonstrates

- One input with `debounce`, and a `throttle` on scroll.
- A scroll listener that updates position using `throttle`.
- Counters showing how many times the function has been called.
- Visual feedback of how each technique behaves in real scenarios.

## 🛠️ Implementation

The `debounce` and `throttle` functions are located in the `src/utils` folder and are written with pure JavaScript.

Each function includes detailed inline comments explaining the logic step by step for better understanding and learning.

## 📂 Components

- `DebounceInput.jsx`: input field with a debounced handler.
- `ThrottleScroll.jsx`: demonstrates scroll event throttling using a fixed interval.

This project is great for understanding the core differences and real-world applications of both techniques.
