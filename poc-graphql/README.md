# GraphQL POC with Apollo Client & React

## ✨ Overview

This Proof of Concept (POC) demonstrates how to use **Apollo Client** to interact with a **GraphQL API** in a **React** application. The project uses the [Rick and Morty GraphQL API](https://rickandmortyapi.com/graphql) and includes examples of data fetching, dynamic routing, search queries, and reusable hooks.

---

## 🎓 What is Apollo Client?

Apollo Client is a comprehensive state management library for JavaScript that enables you to manage both local and remote data with GraphQL. It integrates smoothly with React and provides powerful tools to work with queries, caching, and UI updates.

### Key Features:

- Declarative data fetching with React hooks
- Normalized caching with InMemoryCache
- Auto-updates UI on data changes
- Built-in error/loading state handling
- Lazy queries and pagination support

---

## 📊 Real-world Use Cases

- Building dashboards with live GraphQL data
- Searching/filtering data from remote APIs
- Efficient data caching to avoid over-fetching
- Building Single Page Applications with route-based data

---

## 🔄 Comparison with Other Tools

| Tool          | Type   | REST Support | GraphQL Support | Cache Layer | Ecosystem      |
| ------------- | ------ | ------------ | --------------- | ----------- | -------------- |
| Apollo Client | Client | ❌           | ✅              | ✅          | ✅ Strong      |
| Relay         | Client | ❌           | ✅ (Optimized)  | ✅          | ⚠️ Complex     |
| SWR           | Client | ✅           | ⚠️ (Manual)     | ✅          | ✅ Lightweight |
| React Query   | Client | ✅           | ⚠️ (Manual)     | ✅          | ✅ Popular     |

> ⚠️ Apollo Client is ideal when working directly with GraphQL APIs and you want out-of-the-box cache and query management.

---

## 📂 Project Structure

```
src/
├── hooks/
│   ├── useCharacters.js        # Fetch list of characters
│   └── useCharacter.js         # Fetch character details by ID
│
├── pages/
│   ├── Character.jsx           # Character detail page
│   ├── CharactersList.jsx      # Main listing with links
│   └── Search.jsx              # Search characters and show locations
│
├── App.jsx                     # Route setup with React Router
├── main.jsx                    # ApolloProvider setup
└── index.css                   # Styles
```

---

## 🚀 Demonstrated Features

### ✅ Characters List

- Uses `useCharacters` hook to fetch all characters
- Displays character name and image
- Routing to detail page with React Router

### ✅ Character Detail Page

- Uses `useCharacter` hook
- Fetches character data with `id` param
- Lists all episodes the character appears in

### ✅ Search Functionality

- Search input + button
- Uses `useLazyQuery` to perform search when button is clicked
- Displays location of each character returned

---

## 🔄 Getting Started

```bash
npm install
npm run dev
```

---

## 📃 Final Notes

### Pros

- 🚀 Fast and declarative GraphQL integration
- 🔄 Out-of-the-box caching
- ✅ Easy to compose queries with hooks
- 🧠 Clean and reusable code structure

### Cons

- ❌ Requires GraphQL server (not ideal for REST-only apps)
- ⚠️ Slight overhead if API schema changes frequently

---
