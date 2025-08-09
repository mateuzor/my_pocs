# POC Mobx

A **proof of concept** showing **MobX** with **React + TypeScript** using Vite.  
The app implements a reactive Todo list with **computed values**, **derived filters**, **search**, and an **async bootstrap** to illustrate how MobX tracks state and updates the UI automatically.

---

## 📌 What is MobX?

**MobX** is a battle-tested state management library for JavaScript that focuses on _transparent reactivity_: you mutate plain objects, arrays, and classes; MobX tracks what’s used where, and your UI re-renders **only** where necessary.

Key ideas:

- **Observable state** (plain objects, arrays, classes)
- **Derivations** via `computed` getters
- **Actions** to change state (any function that mutates observables)
- **Reactions** that run when used data changes (e.g., React components wrapped in `observer`)

Official site: https://mobx.js.org/

---

## 🏛 Why use `class` for stores in MobX?

In this POC the store is implemented as a `class` because:

- **Ergonomics** — `makeAutoObservable(this)` turns properties into observables, getters into computed values, and methods into actions in one line.
- **Encapsulation** — The class instance is your domain model (`TodoStore`, `UserStore`), easy to type and test.
- **Natural organization** — Domain-driven: state, computed values, and actions live together.
- **TypeScript-friendly** — Strong typing without extra boilerplate.

> MobX also works with plain objects or hooks, but classes are a popular and clean pattern.

---

## 🎯 How `observer` works

- A component wrapped with `observer()` will **re-render only if the observables it actually uses change**.
- You **do not** need an `observer` “wrapper” at the top of your app like Redux’s `<Provider>`.
  - You can have a **singleton store** imported anywhere.
  - Or you can inject stores via **React Context** (useful for testing or swapping implementations).
- **Best practice:** Put `observer` as close as possible to where the observable data is read.

Example:

```tsx
// Only TodoList uses state, so only it needs observer
export function App() {
  return (
    <>
      <Header /> {/* static */}
      <TodoList /> {/* wrapped with observer */}
    </>
  );
}
```

---

## 📌 MobX vs Context API vs Redux

- **MobX**: Fine-grained reactivity — only re-renders what changes.
- **Context API**: Any context value change re-renders all consumers.
- **Redux**: Global store with immutable reducers and selectors; `<Provider>` is required at the top.

**Data flow diagrams:**

**Redux**

```
[Redux Store Global]
   │ dispatch actions
   ▼
<Provider> → components useSelector()
```

**MobX (singleton)**

```
new TodoStore()
   │ import into components
   ▼
<observer Component> → re-renders only if used data changes
```

**MobX + Context**

```
<StoreProvider value={{ todoStore }}>
   ▼
<observer Component> → useContext() → reacts only to used fields
```

---

## ✅ Pros and ❌ Cons

### Pros

- **Ergonomic**: mutate state directly; minimal boilerplate.
- **Performance**: fine-grained tracking — only components that use changed data re-render.
- **Scales both small and large**: from simple stores to complex domain models.
- **TypeScript-friendly**: works great with classes, getters, and types.
- **Interoperable**: use with any view layer; React via `mobx-react-lite`.

### Cons

- **Implicitness**: reactivity can feel “magical”; needs mental model understanding.
- **Debugging graph**: tracing reaction trees is different from Redux time-travel.
- **Team familiarity**: many teams already know Redux/Zustand; MobX may require onboarding.
- **Side effects**: best practice is to keep mutations within actions for predictability.

---

## 🧭 Real-world Use Cases

- **Complex forms & wizards** with derived validation.
- **Domain-driven UIs** where models encapsulate behavior (classes with methods/computed).
- **Optimistic updates** for CRUD dashboards.
- **Data-heavy apps** needing fine-grained updates (trading, IoT, design tools).
- **Gradual migration** from legacy state (wrap existing objects with observability).

---

## 🔁 How this POC works

- `TodoStore` is a class with observable fields (`todos`, `filter`, `query`, `loading`).
- Derived values:
  - `completedCount`, `activeCount` — computed counters.
  - `filteredTodos` — composed filter + search + sort (all computed).
- Actions: `add`, `toggle`, `remove`, `clearCompleted`, `setFilter`, `setQuery`.
- Async: `bootstrap()` simulates fetching seed data.
- UI: Components are wrapped with `observer` to re-render _only when the data they use changes_.

---

## 🆚 Comparison with Similar Tools

| Feature / Tool | MobX                                 | Redux Toolkit                         | Zustand                    | Jotai                          |
| -------------- | ------------------------------------ | ------------------------------------- | -------------------------- | ------------------------------ |
| Paradigm       | Transparent reactivity, OOP-friendly | Immutable reducers, actions           | Mutating stores (hooks)    | Atomic state via atoms         |
| Boilerplate    | Low                                  | Medium (reduced with RTK)             | Very low                   | Low                            |
| DevTools       | Basic (MobX DevTools community)      | Excellent time-travel, Redux DevTools | Basic (middleware)         | Basic (Jotai DevTools)         |
| Performance    | Fine-grained, reactive               | Depends on selector/memoization       | Good; selector-based       | Good; atom granularity         |
| Learning Curve | Medium (reactivity model)            | Medium (Redux concepts)               | Low                        | Low–Medium (atom mental model) |
| Best For       | Rich models, computed, reactive UIs  | Predictable event logs, ecosystem     | Small–mid apps, simplicity | Co-located state, modularity   |

**Bottom line:** If you like **mutating domain models** with **computed derivations**, MobX is a great fit. If you need **time-travel debugging** and a huge middleware ecosystem, Redux Toolkit might suit better. For **minimal API**, Zustand/Jotai are strong options.

---

## 🚀 Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Run the dev server

```bash
npm run dev
```

Then open the URL printed by Vite (usually **http://localhost:5173**).

### 3) Run tests

```bash
npm test
```

---

## 👀 What to Look For (Step by Step)

1. **Loading seed data**: You’ll briefly see “Loading data…” from the store’s async `bootstrap()`.
2. **Counters react**: The header shows `X done • Y left`. Add a todo or toggle one — numbers update immediately.
3. **Computed filtering**: Switch the filter between **All / Active / Completed** and see the list react.
4. **Search**: Type in the search box (try `work` or `experiment`). The list recomputes on each keystroke.
5. **Granular re-renders**: Only rows that change are re-rendered (thanks to `observer` and MobX’s tracking).

Tip: open React DevTools Profiler and interact — you’ll see minimal re-renders.

---

## 🧪 Testing Notes

- **Store tests** (`TodoStore.test.ts`) assert actions + computed selectors.
- **UI tests** (`App.test.tsx`) render the app, advance fake timers to pass the async bootstrap, and interact with the DOM.

Run with coverage:

```bash
npm run coverage
```

---

## 🔐 Notes on Best Practices

- Prefer `makeAutoObservable(this)` for concise stores; use `flow` for complex async sequences if needed.
- Keep mutations within actions (MobX enforces this in strict mode).
- Avoid deriving data in the render body; use computed getters for memoized derivations.
- Place `observer` only on components that read observable state — **not** globally — to avoid unnecessary renders.

---
