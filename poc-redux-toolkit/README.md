# Redux Toolkit POC

## ✨ Overview

This Proof of Concept (POC) demonstrates the use of **Redux Toolkit** with **RTK Query** in a React + TypeScript application built with **Vite**. The goal is to showcase a modern and scalable structure using best practices for global state management and API consumption.

---

## ⚙️ What is Redux Toolkit?

Redux Toolkit is the official, recommended approach for writing Redux logic. It abstracts repetitive boilerplate and boosts productivity with simplified APIs like `createSlice`, `createAsyncThunk`, and `createApi` (via RTK Query).

### Key Features:

- Simplified store configuration
- `createSlice` to reduce boilerplate
- Built-in middleware and DevTools support
- RTK Query support for API data fetching and caching
- Automatic immutability using Immer

---

## 📊 Real-world Use Cases

- Real-time dashboards (with RTK Query)
- Applications with complex state management (e.g., authentication, filters, theme)
- Projects that need shared state across multiple components
- A scalable alternative to `useContext` + `useReducer`

---

## 🔁 Comparison with Similar Tools

| Tool              | Reactivity | Caching      | Boilerplate | TypeScript | Ecosystem  |
| ----------------- | ---------- | ------------ | ----------- | ---------- | ---------- |
| **Redux Toolkit** | ❌         | ✅ RTK Query | ✅          | ✅         | ✅ Strong  |
| React Context     | ✅         | ❌           | ✅          | ✅         | ⚠️ Limited |
| Zustand           | ✅         | ❌           | ✅          | ✅         | ⚠️ Smaller |
| Recoil            | ✅         | ❌           | ✅          | ⚠️ Partial | ⚠️ In beta |
| Jotai             | ✅         | ❌           | ✅          | ✅         | ⚠️ Limited |

> ⚠️ Note: Redux Toolkit is best suited for complex apps or those that require robust caching, serialization support, and middleware integration.

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── hooks.ts         # Typed useSelector/useDispatch hooks
│   └── store.ts         # Store setup and reducers
│
├── features/
│   ├── counter/
│   │   └── counter-slice.ts    # Ducks pattern slice example
│   └── dogs/
│       └── dogs-api-slice.ts   # RTK Query to fetch dog breeds
│
├── App.tsx              # UI with counter + dog API demo
├── main.tsx             # Redux Provider + entry point
└── index.css            # Global styles
```

---

## 🚀 Demonstrated Features

### Counter

- Increment by 1 (`increment`)
- Increment by specific amount (`amountAdded`)
- Uses `createSlice` for reducer and actions

### RTK Query - Dog Breeds

- Fetches data from [The Dog API](https://thedogapi.com)
- Allows users to select how many breeds to fetch (5, 10, 15, 20)
- Displays breed name and image in a table
- Uses auto-generated hook `useFetchBreedsQuery`

---

## 🔄 Getting Started

```bash
npm install
npm run dev
```

---

## 📃 Final Notes

### Pros

- 🏆 Intuitive, declarative API
- ✨ Official Redux team support
- ✅ Excellent TypeScript support
- ⚙️ RTK Query replaces need for Axios/SWR

### Cons

- ❌ Slight learning curve for beginners
- 🎮 Can be overkill for small apps

---
