# 🧪 Next.js Rendering Strategies Demo

This project demonstrates the **three main rendering strategies** available in [Next.js](https://nextjs.org):

- ✅ **SSG (Static Site Generation)**
- ✅ **SSR (Server Side Rendering)**
- ✅ **ISR (Incremental Static Regeneration)**

Each route uses the same mocked data source (`fetchPost`) and displays a timestamp passed from the server. This makes it easy to understand when the HTML was generated during different phases.

---

## 🚀 Getting Started

1. Install dependencies:

```bash
npm install
```

2. Build the application:

```bash
npm run build
```

3. Start the production server:

```bash
npm start
```

> ⚠️ ISR and SSG **do not behave correctly** in development mode (`npm run dev`). You must run the app in production mode to see proper caching and regeneration behavior.

Then open in your browser:

- [http://localhost:3000/ssg](http://localhost:3000/ssg)
- [http://localhost:3000/ssr](http://localhost:3000/ssr)
- [http://localhost:3000/isr](http://localhost:3000/isr)

---

## 🧠 Rendering Strategies Explained

### 📦 SSG - Static Site Generation

> The HTML is generated **at build time** and served as static content.

#### 🔧 How it works

```ts
export async function getStaticProps() {
  return { props: { ... } }
}
```

#### ✅ Pros

- Very fast (served via CDN)
- Ideal for content that rarely changes (e.g., marketing pages, blogs)

#### ❌ Cons

- Content only updates with a new build
- Not suitable for frequently changing data

---

### 🌐 SSR - Server Side Rendering

> The HTML is generated **on every request**.

#### 🔧 How it works

```ts
export async function getServerSideProps() {
  return { props: { ... } }
}
```

#### ✅ Pros

- Always up-to-date
- Great for SEO with dynamic data (e.g., dashboards, personalized pages)

#### ❌ Cons

- Slower performance compared to SSG
- Increases server load

---

### ♻️ ISR - Incremental Static Regeneration

> A hybrid of SSG and SSR: statically generated pages with **automatic background updates**.

#### 🔧 How it works

```ts
export async function getStaticProps() {
  return {
    props: { ... },
    revalidate: 10,
  }
}
```

#### ✅ Pros

- Near-SSG performance
- No need to rebuild for every change
- Scales well with CDN caching

#### ❌ Cons

- May serve stale data for a few seconds
- First request after revalidation can still be outdated

---

## 📂 Route Summary

| Route  | Strategy | Method                        | Update Timing             |
| ------ | -------- | ----------------------------- | ------------------------- |
| `/ssg` | SSG      | `getStaticProps`              | At build time             |
| `/ssr` | SSR      | `getServerSideProps`          | On every request          |
| `/isr` | ISR      | `getStaticProps + revalidate` | After revalidation period |

---

## 🧪 How to Test Behavior

These strategies only behave correctly in production mode (`npm run build && npm start`). In development mode, all pages act like SSR.

### ✅ Steps to test properly:

1. Run:

```bash
npm run build
npm start
```

2. Visit `/ssg`:

   - See a timestamp.
   - Refresh → timestamp will not change unless you rebuild.

3. Visit `/ssr`:

   - Refresh → timestamp changes every time.

4. Visit `/isr`:
   - See a timestamp.
   - Wait more than 10 seconds.
   - Refresh → timestamp remains the same.
   - Refresh again → timestamp is updated.

> 💡 Tip: Add `console.log()` inside each data-fetching function (`getStaticProps`, `getServerSideProps`, etc.) to observe when they are re-executed.

---

## 🧪 Mocked API

The `fetchPost` function simulates a real API and adds a timestamp to the content:

```ts
export async function fetchPost() {
  return {
    title: "Sample post",
    timestamp: new Date().toLocaleTimeString(),
  };
}
```

---

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/)
- React 18
- TypeScript

---

## 📚 Resources

- [Next.js Docs - Data Fetching](https://nextjs.org/docs/basic-features/data-fetching)
- [Incremental Static Regeneration](https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration)

---
