# Progressive Hydration Demo

A simple demonstration of **Progressive Hydration** in React Islands architecture. Components are server-rendered but only become interactive when they scroll into view, loading JavaScript chunks on-demand.

## 🎯 What is Progressive Hydration?

Progressive Hydration is a technique where:

- The full page is **server-rendered** (SSR) for fast initial load
- JavaScript for components is **loaded only when needed** (lazy loading)
- Components become **interactive gradually** as for our need
- Reduces initial bundle size and improves performance

## 📁 Project Structure

```
├── server.js              # Express server with SSR
├── src/
│   └── App.cjs            # Main React component (SSR)
├── views/
│   └── template.html      # HTML template
└── public/
    ├── hydrate.js         # Intersection Observer logic
    └── islands/
        ├── island1.js     # First interactive component
        └── island2.js     # Second interactive component (with delay)
```

## 🏃‍♂️ Setup and run

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run the server:**

   ```bash
   npm run dev
   ```

3. **Open browser:**

   ```
   http://localhost:3000
   ```

4. **Open DevTools and scroll down to see:**
   - Network tab: JavaScript chunks loading
   - Console: Hydration logs
   - Page: Buttons becoming interactive

## 🧪 What You'll See

1. **Page loads** with disabled gray buttons
2. **Loads the first island**:
   - Network request for `island1.js`
   - Button instantly turns green and becomes clickable
3. **Scroll to second island**:
   - Network request for `island2.js`
   - 2-second delay, then button turns blue and becomes clickable
4. **Click buttons** to increment counters and confirm interactivity

## 🔧 Technical Details

- **React.createElement**: Used for SSR without build step
- **CommonJS**: Server-side uses `require`/`module.exports`
- **ES Modules**: Client-side uses `import`/`export`
- **No Build Tools**: Vanilla setup without Webpack/Babel
- **Intersection Observer**: Modern API for scroll detection
- **Dynamic Imports**: `import()` for code splitting

## 🚀 Benefits of Progressive Hydration

- **Faster Initial Load**: No JavaScript for islands initially
- **Reduced Bundle Size**: Code splitting by component
- **Better UX**: Content visible immediately (SSR)
- **Progressive Enhancement**: Works without JavaScript, better with it
- **Performance**: Only load what's needed, when it's needed

## 💡 Use Cases

Perfect for:

- Large applications with many components
- E-commerce sites with product widgets
- Dashboards with charts/widgets
- Blog sites with interactive elements
- Any site where not all components need to be interactive immediately

---

_This demo showcases the core concepts of Progressive Hydration in the simplest way possible, without complex build tools or frameworks._
