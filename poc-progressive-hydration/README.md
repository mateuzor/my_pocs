# poc-progressive-hydration

This is a Proof of Concept (PoC) project demonstrating **Progressive Hydration** using React 18 and Intersection Observer.

## 📖 What is Progressive Hydration?

Progressive Hydration is a rendering pattern where the HTML is server-rendered and then selectively hydrated on the client side based on conditions (e.g., when the component enters the viewport). This reduces JavaScript bundle size and improves **Time To Interactive (TTI)**.

## ✅ Benefits

- 🚀 Faster First Contentful Paint (FCP)
- ⚡ Better Time To Interactive (TTI)
- 📦 Reduced initial JS bundle size
- 🧠 Better UX for static-heavy pages
- 🧩 Enables code-splitting and lazy hydration

## ❌ Trade-offs

- ⚠ Slightly more complex logic (hydration conditions)
- ❗ Potential delays in interactivity
- 👀 Requires careful monitoring of hydration mismatches
- 🔧 Some overhead to manage hydration triggers (e.g. IntersectionObserver)

## 🌍 Real-world Use Cases

- Product pages in eCommerce sites (e.g., lazy hydrate reviews)
- News portals where comments or ads hydrate on scroll
- Dashboards with data widgets below the fold
- “You may also like” sections

## 🛠 How to Run

```bash
# 1. Install dependencies
npm install

# 2. Build the project
npm run build

# 3. Start the server
npm start
```

Visit: [http://localhost:3000](http://localhost:3000)

## 👀 What to Observe

1. When page loads, you’ll see only the heading.
2. Scroll down slowly until the placeholder “Loading user profile...” appears.
3. Once the component enters the viewport, it hydrates and shows real content (`Jane Doe`).

No flash. No full app hydration. Just what's needed, when it's needed.

---
Built with ❤️ using React + Vite + Express.
