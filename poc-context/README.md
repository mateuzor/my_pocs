# React useContext Advanced POC

This POC demonstrates how to manage **multiple global states** using React's `useContext` hook in combination with the Context API. It showcases:

- `ThemeContext`: Toggle between light and dark mode.
- `AuthContext`: Simulate login and logout states.
- `LanguageContext`: Switch the UI language between English and Portuguese.

---

## 🧪 How to Run

```bash
npm install
npm run dev
```

---

## 👀 What to Observe

- **Theme Toggling**: Watch the background and text colors shift.
- **Authentication**: Log in with a fake username, log out, and see state changes.
- **Language Switch**: Change app language with real-time label updates.
- **Global State Access**: All components can read and update the global state via context.

---

## 🧠 When to Use `useContext`

The `useContext` hook is ideal when:

- You have **simple and limited global state** (like theme, locale, auth).
- You want **quick access to shared values** across the tree.
- You need to avoid **prop drilling** (passing data through many layers of components).

It's perfect for lightweight global state management _within the boundaries of UI scope_.

---

## ✅ Pros

- **Simplicity**: No boilerplate like Redux or Zustand.
- **Native**: Built into React — no external libraries needed.
- **Composable**: Easy to create modular, isolated contexts.
- **Declarative**: State is naturally scoped and follows React's reactivity.

---

## ⚠️ Cons

- **Re-renders**: Every context value change causes **all consumers to re-render**.
- **Debugging**: Context doesn't offer great devtools support compared to Redux or Zustand.
- **No middleware**: Can't easily intercept or orchestrate async flows.
- **Performance**: Not ideal for **frequently changing or large state trees**.

---

## 🤔 Why Not Redux, Zustand, or Others?

- **Redux**: Powerful, but has more boilerplate and requires setup with actions, reducers, etc. Best for large-scale, enterprise-grade applications.
- **Zustand**: Minimal and flexible with better performance for frequently changing state, but introduces an external dependency.
- **Recoil / Jotai**: Focused on fine-grained reactivity and derived state, useful for complex relationships between data.

> If you're managing **UI state**, `useContext` is often enough. If you're dealing with **server state, caching, or complex interdependencies**, tools like Zustand, Redux Toolkit, or React Query are more appropriate.

---

## 💡 Best Use Cases for `useContext`

- Theme switching (dark/light mode)
- Authentication state (logged in/out)
- Language and localization (i18n)
- Feature toggles and environment flags
- Access to utility functions or settings

---

## 🧱 Summary Table

| Feature                        | useContext | Redux / Zustand    |
| ------------------------------ | ---------- | ------------------ |
| Setup Complexity               | Minimal    | Moderate to High   |
| External Dependencies          | ❌         | ✅                 |
| Dev Tools                      | Basic      | Advanced           |
| Ideal For                      | UI state   | App/global logic   |
| Async Middleware               | ❌         | ✅ (Redux Toolkit) |
| Performance (frequent updates) | ⚠️         | ✅                 |

---
