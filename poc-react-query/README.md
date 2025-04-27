# 🐶 Dog Breeds Pagination - React Query POC

This is a **Proof of Concept (POC)** project demonstrating the use of **React Query** for asynchronous data management with pagination, built using **Vite.js** and **TypeScript**.  
The data is fetched from [The Dog API](https://thedogapi.com/).

---

## ✨ Features

- Paginated query for dog breeds
- Navigation buttons for previous and next pages
- Loading and error states
- Integrated React Query Devtools for live inspection
- API Key managed securely using environment variables

---

## 📂 Project Structure

```
src/
├── @types/
│   └── dogType.ts         // Type definitions for the dog data
├── components/
│   └── PaginationExample.tsx  // Main component handling list and pagination
├── hooks/
│   └── useDogs.ts          // Custom hook for data fetching and caching
├── main.tsx                // Vite's standard entry point
├── App.tsx                 // Uses the PaginationExample component
└── index.css               // Basic styles if needed
```

---

## 📄 Main Files Overview

### `@types/dogType.ts`

Defines TypeScript interfaces representing the API response structure.

### `hooks/useDogs.ts`

Custom hook that fetches dog breeds using Axios and manages cache, loading status, and pagination state through React Query.  
The API Key is now securely accessed through `import.meta.env.VITE_DOGS_API_KEY`.

### `components/PaginationExample.tsx`

Component responsible for:

- Displaying a list of dog breed images
- Handling page navigation
- Showing loading and error feedback
- Integrating React Query Devtools

**Fix:**  
In the `PaginationExample.tsx`, the `error` object returned by React Query may be `unknown`.  
Update the error handling to safely check its type:

```tsx
{
  status === "error" && error instanceof Error && (
    <div>Error: {error.message}</div>
  );
}
```

This approach ensures type safety and removes TypeScript warnings.

---

## 🚀 Getting Started

### Prerequisites

- Node.js installed
- npm or yarn installed

### Setup

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Create a `.env` file at the project root and add your API key:

```bash
VITE_DOGS_API_KEY=your-api-key-here
```

> Note: In Vite projects, environment variables must start with `VITE_` to be accessible inside your application.

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Visit `http://localhost:5173` in your browser.

---

## 🔑 Notes

- An API Key from [The Dog API](https://thedogapi.com/) is required.
- API Key is loaded through a `.env` file.
- CORS headers are set for local development.

### How to Verify React Query in Action

1. Open your application in the browser.
2. Inspect the React Query Devtools floating at the bottom of the screen.
3. You can see queries being fetched, cache status, background refetches, and retry attempts.
4. Navigate between pages to observe how caching and background updates behave.
5. Simulate slow network conditions to observe loading states in action.

---

# 📖 About React Query

[React Query](https://tanstack.com/query/latest) is a powerful data-fetching and state-management library for React applications. It focuses on **server-state management**, offering tools for asynchronous operations like fetching, caching, synchronizing, and updating remote data.

## ✅ Pros of React Query

- Automatic caching and background refetching
- Simplified data fetching logic
- Easy pagination and infinite scroll implementation
- Built-in support for retries and error handling
- Devtools for easy debugging
- Mutations management (POST, PUT, DELETE requests)

## ❌ Cons of React Query

- Adds an extra dependency to your project
- Learning curve if coming from traditional Redux setups
- Might feel overkill for very small projects with minimal data fetching
- Complex cache invalidation strategies might require additional thinking

## 🔄 Trade-offs

| Aspect               | Traditional Fetching         | React Query                         |
| -------------------- | ---------------------------- | ----------------------------------- |
| Caching              | Manual                       | Automatic and configurable          |
| Background updates   | Manual (useEffect + polling) | Native support                      |
| Loading/Error states | Manual                       | Native support                      |
| Code complexity      | Simple for small apps        | Better scalability for complex apps |

## 🌎 Real-world Use Cases

- **E-commerce**: Product listings with filters and paginated results
- **Social media apps**: News feeds and timelines with infinite scrolling
- **Admin dashboards**: Managing data tables with server-side pagination
- **Analytics apps**: Periodic background refetching of analytics data
- **Content management systems**: Fetching and editing content entries

## 🚀 Why Use React Query?

- If your app relies heavily on external APIs.
- If you want seamless background updates and user-friendly loading experiences.
- If you want to optimize server interactions without rewriting boilerplate data fetching code.

---

# 🎯 Summary

This POC demonstrates how **React Query** simplifies fetching and managing server-side data by:

- Providing effortless caching.
- Enabling paginated data queries.
- Offering tools for scalable and maintainable code architecture.

> React Query is not a replacement for global state management like Redux or Zustand — it is specialized for **server state**, not client UI state.

---

# 📚 References

- [React Query Official Documentation](https://tanstack.com/query/latest)
- [The Dog API Documentation](https://thedogapi.com/)
- [Vite Documentation](https://vitejs.dev/)

---

_Developed as a learning POC to explore React Query's real-world capabilities._ 🚀

---
