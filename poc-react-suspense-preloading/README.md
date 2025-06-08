# poc-react-suspense-preloading

This Proof of Concept demonstrates how to preload React components using `React.lazy` and `Suspense` for better UX in large applications.

---

## 📌 What is it?

React's lazy loading mechanism lets us load components only when needed. This POC takes it further by **preloading a component** when the user is about to interact (e.g., on hover), reducing perceived load time.

---

## ✅ Features

- React.lazy for on-demand component loading
- Suspense for graceful fallback rendering
- Preloading strategy using `import()` on hover

---

## 🚀 How to Run

```bash
npm install
npm run dev
```

Open: [http://localhost:5173](http://localhost:5173)

---

## 🔍 What to Observe

1. The app shows a button labeled **"Load Heavy Component"**
2. On hover (before clicking), the component is **preloaded silently**
3. On click, the component is shown **without delay** if it was already preloaded
4. Check the **network tab** to observe when `HeavyComponent.tsx` is actually loaded

---

## ✅ Pros

- Greatly improves user-perceived performance
- Easy to implement with native React tools
- Enables partial hydration strategies

---

## ❌ Cons

- No support for server-side rendering
- Requires user interaction to trigger preloading
- Manual import() usage may not scale well

---

## 🌍 Real-World Use Cases

- Dashboards with modular widgets
- E-commerce sites with product detail modals
- Admin panels with tabbed navigation

---

## 📄 License

MIT © 2025