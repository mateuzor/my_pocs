# poc-react-virtualized-list

A Proof-of-Concept project demonstrating a simple virtualization system for long lists in React using pure logic (no external libraries).

---

## 📌 What is it?

A virtualized list component that only renders visible DOM elements based on scroll position, which boosts performance for lists with thousands of items.

---

## ✅ Features

- Handles thousands of rows efficiently
- Scrollable container with minimal rendering
- Fully controlled without third-party dependencies
- Simple and extensible

---

## 🚀 How to Run

```bash
npm install
npm run dev
```

Then open your browser at: [http://localhost:5173](http://localhost:5173)

---

## 👀 How to Test and Observe the Virtualization in Action

### 1. Use Chrome DevTools (F12 > Elements)

- Inspect the list container.
- You'll see only ~20 elements rendered at any time.
- As you scroll, the DOM nodes remain around 20 — only their content and position change.

### 2. Measure Performance

- Open **DevTools > Performance** tab.
- Click "Record", scroll quickly, and stop recording.
- You'll see smooth frame rates even when scrolling through thousands of items.

### 3. Console Debugging

You can log each rendered item to see the virtualization:

In `VirtualizedList.tsx`, add inside the `.map()` function:

```tsx
console.log("Rendering item:", item);
```

This shows how only the visible subset is rendered.

### 4. Compare to a Non-Virtualized List (Optional)

Replace the component with:

```tsx
{
  items.map((item) => (
    <div key={item} style={{ height: "35px" }}>
      {item}
    </div>
  ));
}
```

Reload the app and:

- You'll notice slowness or lag.
- DevTools will show thousands of DOM nodes.
- CPU and memory usage will spike.

---

## ✅ Pros

- ⚡ Fast rendering for large datasets
- 🧩 Simple and dependency-free
- 🔧 Easy to customize for tables or complex rows

---

## ❌ Cons

- ❌ No support for variable row heights
- ⚠️ Manual scroll logic (vs using a lib like `react-window`)
- 🚫 Limited accessibility unless extended

---

## 🌍 Real-World Use Cases

- Infinite scroll lists
- Email inboxes
- Logs or monitoring tools
- Admin dashboards with huge datasets

---
