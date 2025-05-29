# POC - Next.js Server Components Only

This is a Proof of Concept (POC) application built with **Next.js 14+** that uses **only Server Components**, leveraging the full power of React Server Components introduced in React 18.

## 🌐 What is this?

A fully server-rendered Next.js application that does not send any JavaScript to the client. All rendering and data fetching is done on the server.

---

## ✅ Pros

- 🧠 No JavaScript sent to the client
- ⚡ High performance, low bundle size
- 🔒 Secure (sensitive logic/data remains server-side)
- 🧹 Cleaner architecture with no hydration

---

## ❌ Cons

- 🚫 No client-side interactivity (e.g., `useState`, `onClick`, etc.)
- 🔄 Full page reloads for dynamic updates
- 🎨 Limited UX for animations and interactions

---

## 💡 Real-World Use Cases

- Static marketing sites
- Blog and news portals
- Internal dashboards and admin tools
- SEO-focused content sites
- Public-facing product documentation

---

## 🚀 How to Run This Project

### 1. Clone the repository

```bash
git clone https://github.com/mateuzor/my_pocs
cd poc-nextjs-server-components
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 What You Should Notice

1. **All content is server-rendered** – no JavaScript bundles are sent to the client.
2. **No client-side interactivity** – clicking, state updates, etc., are not supported.
3. **Fast initial page load** due to pure HTML being served.
4. Use DevTools → Network → JS tab → See there's no JavaScript loaded for this route.

---

## 🧩 Tech Stack

- Next.js 14
- React 18 Server Components
- App Router (`/app` directory)
- TypeScript

---
