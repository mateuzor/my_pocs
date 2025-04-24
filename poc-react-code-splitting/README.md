# React Code Splitting POC

This project demonstrates the difference between a React application **with and without code splitting**, using [`React.lazy`](https://reactjs.org/docs/code-splitting.html#reactlazy) and [`Suspense`](https://reactjs.org/docs/concurrent-mode-suspense.html). The goal is to help you visualize the impact of loading large components dynamically instead of bundling them with the initial JavaScript payload.

---

## 🧠 What is Code Splitting?

Code splitting is a technique where you break your JavaScript bundle into smaller chunks. This way, instead of loading the entire app at once (which can increase load time and hurt performance), you load only what's needed at the moment.

In React, this is typically done using:

```js
const SomeComponent = React.lazy(() => import("./SomeComponent"));
```

And rendered with:

```js
<Suspense fallback={<div>Loading...</div>}>
  <SomeComponent />
</Suspense>
```

---

## 📂 Project Structure

- **`/with-code-splitting`**  
  Loads the `HeavyComponent` (which uses the large `chart.js` library) only when it is rendered. This keeps the initial bundle size small.

- **`/without-code-splitting`**  
  Imports `HeavyComponent` directly, meaning `chart.js` is included in the initial JavaScript bundle — even if the component is not used immediately.

---

## ▶️ How to Run

```bash
# With Code Splitting
cd with-code-splitting
npm install
npm run dev

# Without Code Splitting
cd ../without-code-splitting
npm install
npm run dev
```

> Both projects use [Vite](https://vitejs.dev) as the bundler and dev server.

---

## 🔍 What to Observe

1. **Initial Bundle Size**

   - Tools like [Bundlephobia](https://bundlephobia.com/) or `vite build --report` can help visualize the difference.
   - With code splitting, the bundle loaded at first is significantly smaller.

2. **Loading Behavior**

   - The version with code splitting shows a loading state while `HeavyComponent` is being fetched.
   - The version without it may take longer to load the initial page, especially on slow networks.

3. **User Experience**
   - Code splitting improves perceived performance by deferring heavy scripts until they're needed.

---

## 📊 Why `chart.js`?

The `chart.js` library is intentionally used here as a "heavy" dependency to exaggerate the difference in bundle size and performance. It mimics real-world use cases like dashboards, analytics views, or admin panels that aren't immediately needed on first load.

---

## ✅ Summary

| Feature                     | With Code Splitting | Without Code Splitting |
| --------------------------- | ------------------- | ---------------------- |
| Initial Bundle Size         | Smaller             | Larger                 |
| Chart.js Loaded Immediately | ❌                  | ✅                     |
| Uses React.lazy + Suspense  | ✅                  | ❌                     |
| Optimized Performance       | ✅                  | ❌                     |

---

Feel free to clone, run and adapt this POC for your own demos or talks. Happy coding!
