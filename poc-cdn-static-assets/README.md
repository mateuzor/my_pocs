# poc-cdn-static-assets

This proof-of-concept (POC) demonstrates how to serve static assets in a frontend project using a CDN (Content Delivery Network).

## 🌐 What is a CDN?

A **Content Delivery Network** is a globally distributed network of servers that delivers static assets (images, CSS, JS) based on user's geographical location. It improves performance and scalability by caching content close to the user.

## ✅ Pros

- **Faster loading times** (especially for users far from your origin server)
- **Reduced server load**
- **Highly available and resilient**
- **Optimized for caching and delivery**

## ⚠️ Cons

- **Less control** over external resources
- **Privacy concerns** with third-party tracking
- **Availability risk** if the CDN provider has issues
- **Versioning** can be tricky if caching is aggressive

## 💡 Use Cases

- Hosting third-party libraries (e.g., Bootstrap, jQuery, FontAwesome)
- Offloading image or video hosting
- Delivering your own static content via a service like Cloudflare, Amazon CloudFront, or jsDelivr

## 🚀 Getting Started

### 1. Install dependencies:

```bash
npm install
```

### 2. Start a local server:

```bash
npm start
```

This will serve the content from the `public/` folder.

### 3. Open the browser

Navigate to:

```
http://localhost:3000
```

You will see an HTML page styled with Bootstrap from CDN and an emoji image loaded via CDN.

## 🧐 What to Look For

- Check **Network tab** in DevTools: assets like Bootstrap CSS and emoji image come from external CDN domains.
- No local CSS or images are bundled—everything is pulled from external CDNs.

## 📂 Project Structure

```
poc-cdn-static-assets/
├── package.json
├── public/
│   └── index.html
└── src/
```

## 📘 License

MIT © 2025
