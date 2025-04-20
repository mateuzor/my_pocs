# Zustand vs Redux – Comparison POC

This proof of concept compares the usage of Zustand and Redux Toolkit in a simple React + TypeScript application. The app features a counter with both synchronous and asynchronous actions, as well as a click counter to observe re-renders.

## 📂 Structure

```
zustand-vs-redux-counter/
├── public/
├── src/
│   ├── components/
│   │   └── Counter.tsx
│   ├── redux/
│   │   ├── counterSlice.ts
│   │   └── store.ts
│   ├── zustand/
│   │   └── useCounterStore.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── vite.config.ts
```

## 🚀 How to run the project

```bash
npm install
npm run dev
```

Then visit:

- `/zustand` to test Zustand
- `/redux` to test Redux

---

## ⚖️ Comparison

| Criteria       | Zustand                    | Redux Toolkit                  |
| -------------- | -------------------------- | ------------------------------ |
| Boilerplate    | Minimal                    | Moderate (slice, store, hooks) |
| Complexity     | Low                        | Moderate                       |
| Scalability    | Medium                     | High                           |
| Middlewares    | Manual (with JS functions) | Built-in (thunk, middleware)   |
| DevTools       | Simple                     | Full-featured Redux DevTools   |
| Learning Curve | Low                        | Moderate                       |
| Performance    | High (fewer re-renders)    | High (with proper memoization) |
| Bundle Size 📦 | Smaller (~1KB)             | Larger (~10KB+)                |

---

## 📸 DevTools Insight

- **Zustand**: fewer re-renders, less verbose
- **Redux**: more control and detailed state traceability

(We recommend using React Developer Tools and the Redux DevTools Extension to visualize it)

---

## 📊 Bundle Analysis

Run:

```bash
npm install source-map-explorer --save-dev
npm run build
npx source-map-explorer dist/assets/index-*.js
```

You’ll clearly see the bundle size difference between Zustand and Redux.

---

## 🧠 Conclusion

- Use **Zustand** for small projects, prototypes, or when simplicity and performance are key.
- Use **Redux Toolkit** when you need more structure, middleware integration, logging, detailed state control, or you're working with a large team.

---

## ✨ Extras

- ✅ Custom hooks can be used with both libraries
- 🔄 You can partially migrate from Redux to Zustand in modular apps
- 💡 Zustand is great for isolated state slices (e.g., theme, UI, cart, etc.)

---

## 🚀 Suggestions for extending this POC:

- Zustand state persistence (e.g., localStorage)
- RTK Query integration with Redux
- Global state with React Context for comparison
- Unit testing with Vitest or Jest
