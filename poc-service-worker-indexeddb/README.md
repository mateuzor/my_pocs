# POC - Advanced Caching with Service Workers and IndexedDB

This project is a Proof of Concept that demonstrates how to use **Service Workers** to cache static assets and API responses, and how to store dynamic API data into **IndexedDB** for offline usage.

## 🌐 What Are Service Workers?

Service Workers are background scripts that intercept network requests, cache assets, and allow web apps to function offline or with poor network conditions.

## 🧠 What is IndexedDB?

IndexedDB is a client-side NoSQL storage that lets you persist large amounts of structured data and query it using indexes.

## ✅ Benefits

- Offline-first experience
- Improved performance with cached assets
- Persistent storage for dynamic data
- Control over cache strategies

## ⚠️ Trade-offs

- More complex than basic cache APIs
- Browser compatibility quirks
- Requires HTTPS (except localhost)
- IndexedDB API is verbose and asynchronous

## 🔍 Real-World Use Cases

- PWAs (Progressive Web Apps)
- News apps that cache articles
- E-commerce platforms for offline browsing
- Productivity tools like note-taking apps

## 🚀 Getting Started

1. Install dependencies (only `serve` is used for development):

```bash
npm install
```

2. Start the static server:

```bash
npm start
```

3. Open the browser at:

```bash
http://localhost:3000
```

## 🧪 What You Should Observe

- The app registers a Service Worker.
- Clicking the "Fetch and Cache Data" button fetches posts from an API.
- Posts are displayed and stored in IndexedDB.
- On reload or offline mode, cached files are served.
- IndexedDB persists the last fetched posts even without network.

## 📁 Project Structure

```
poc-service-worker-indexeddb/
├── www/
│   ├── index.html
│   ├── app.js
│   └── sw.js
├── package.json
└── README.md
```
