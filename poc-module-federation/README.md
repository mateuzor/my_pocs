# POC - Module Federation

This is a Proof of Concept (POC) using **Module Federation** from Webpack 5 with **React** to demonstrate how two separate applications can share code with each other at runtime.

## Structure

- `host/` – the main application that consumes remote components
- `remote/` – the remote application that exposes components

## How to run

1. Clone this repository:

   ```bash
   git clone <url>
   cd poc-module-federation
   ```

2. Install dependencies for both applications:

   ```bash
   cd remote
   npm install
   npm start
   ```

   In another terminal:

   ```bash
   cd host
   npm install
   npm start
   ```

3. Visit [http://localhost:3000](http://localhost:3000) to see the Host App consuming the Button component from the Remote App.

## Technologies

- React
- Webpack 5
- Module Federation

---

## What is Module Federation?

Module Federation is a **native feature introduced in Webpack 5** that allows multiple, separately built applications to share code and dependencies **at runtime**. It enables a new kind of architecture where you can load remote components or entire applications dynamically without needing to redeploy your main app.

Technically, it works through the `ModuleFederationPlugin`:

```js
const { ModuleFederationPlugin } = require("webpack").container;
```

This plugin allows you to define which modules are exposed by an app (remote) and which modules should be consumed by another (host), along with shared dependencies like React.

Module Federation has become especially powerful in **micro frontend architectures**, allowing different teams to deploy independently while maintaining a unified user experience.

---

## Understanding Module Federation in Real Life

Module Federation lets you treat one application as a **live library provider** and another as a **consumer**, loading modules **dynamically at runtime**. Think of the remote as a "live NPM package" that gets fetched over the web.

### Is it bidirectional?

Yes! You can expose modules from either side. The `host` can consume `remote` modules, and the `remote` can also consume from the `host` if configured properly.

### Production Setup Example

In a real-world scenario:

- Each application (host or remote) is deployed separately.
- The host references the remote's `remoteEntry.js` from a **public URL**, like:
  ```js
  remotes: {
    analytics: 'analytics@https://analytics.company.com/remoteEntry.js',
    users: 'users@https://users.company.com/remoteEntry.js'
  }
  ```
- When the user visits the host app, it loads those remotes on demand from the internet.

### Use Case: E-Commerce Platform

| App               | Role                    | Maintained by |
| ----------------- | ----------------------- | ------------- |
| `host`            | Layout, routing, shell  | Platform team |
| `cart-remote`     | Shopping cart           | Checkout team |
| `product-remote`  | Product detail / search | Catalog team  |
| `checkout-remote` | Checkout and payment    | Payments team |

Each team can develop, deploy and iterate **independently**, and the host assembles everything in runtime.

### Benefits

- 🔄 **Independent deployments**
- 🧩 **Modular architecture** (each remote is self-contained)
- 👥 **Team autonomy**
- ♻️ **Shared libraries** without bundling duplicates
- ⚡ **Instant updates** in the host when the remote changes (no need to redeploy the host)

### Challenges

- 📦 Shared packages (like React) must be **aligned in version and config**
- 🚨 Remotes must be **always online** — if `remoteEntry.js` is unreachable, parts of the app might break
- 🧪 Debugging can be harder in runtime-shared code

Module Federation is a game-changer for micro frontends and modular architecture.
