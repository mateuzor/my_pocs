# React Code Splitting POC

This project demonstrates the difference between having a React application **with and without code splitting**, using [`React.lazy`](https://reactjs.org/docs/code-splitting.html#reactlazy) and [`Suspense`](https://reactjs.org/docs/concurrent-mode-suspense.html). The goal is to help you visualize the impact of loading large components dynamically instead of bundling them with the initial JavaScript payload.

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

- **`/components/HeavyComponent`**
  This is where our `HeavyComponent` is (which uses the large `chart.js` library), it will only be rendered when we need it.

---

## ▶️ How to Run

```bash
npm install
npm run dev
```

---

## 🔍 What to Observe

1. **Initial Bundle Size**

   - The bundle loaded at first is significantly smaller with code splitting, we can observe that on the network tab on the browser.
   - We can also run `npm run build`, and notice the difference with and without the code splitting technique. With code splitting we will have one more `.js` file.

Without Code Splitting  
<img width="1917" height="1015" alt="Screenshot 2025-08-25 at 9 24 08 PM" src="https://github.com/user-attachments/assets/4b677ffd-fc7b-4ff7-b31b-7f0b63f41ae0" />
With Code Splitting
<img width="1918" height="1015" alt="Screenshot 2025-08-25 at 9 25 43 PM" src="https://github.com/user-attachments/assets/e92957e6-1228-4ec2-b7cc-ac54680d98da" />

Build differences (With x Without)

<img width="702" height="486" alt="Screenshot 2025-08-25 at 9 49 49 PM" src="https://github.com/user-attachments/assets/55716075-5b19-4daa-b4db-5ec9a709a2ff" />

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
