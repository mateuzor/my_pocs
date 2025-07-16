# poc-mutation-resize-observer

Mini project showcasing **MutationObserver** and **ResizeObserver** browser APIs.

## ✨ What’s inside?

- **MutationObserver** – watches a `<ul>` list and reports when new `<li>` items are appended or removed.
- **ResizeObserver** – tracks the size of a resizable `<div>` and prints live dimensions.
- Minimal setup: plain HTML, CSS, and vanilla ES modules.

## 📦 Setup

```bash
npm install
```

## 🚀 Run

```bash
npm start
```

Open the URL and:

1. Click **Add Item** – observe mutation logs update.
2. Click **Remove Last Item** – list updates and log adjusts accordingly.
3. Drag the bottom‑right corner of the green box – observe resize logs.

https://github.com/user-attachments/assets/6696d8aa-b947-4aab-9e69-0eeb6c7cdcca
   

## 🔍 Explanation

### 🔁 MutationObserver

The `MutationObserver` is a browser API that observes changes to the DOM tree such as **adding**, **removing**, or **modifying** child elements, attributes, or text content.

**How it works in this POC:**

- It watches a `<ul>` list.
- Whenever a new `<li>` is added or removed, the observer triggers.
- The log below the list is updated to show the current number of items.

✅ Use Cases:

- Monitor changes in dynamic apps (e.g., new messages, injected ads, user content)
- Track additions/removals in complex layouts (like dashboards)
- Validate DOM updates for testing or accessibility

### 📏 ResizeObserver

The `ResizeObserver` is an API that allows you to watch an element for changes to its **content size** (width/height).

**How it works in this POC:**

- Observes a `<div>` box that's resizable by the user.
- On any size change, logs its dimensions in real time.

✅ Use Cases:

- Dynamically adjust layout or components based on container size
- Track resizes of charts, maps, or embedded content
- Observe flex or grid elements that may change with screen size

## 🔍 Pros & Cons

| API                  | Pros                                                                                  | Cons / Caveats                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **MutationObserver** | • Detects DOM changes asynchronously <br>• Fine‑grained filters (attributes, subtree) | • No legacy IE support <br>• Can be chatty – requires batching/debouncing                               |
| **ResizeObserver**   | • Native way to detect element resize <br>• Performs off main layout pass             | • Still relatively new – Safari <16 bugs <br>• Beware infinite loops when mutating size inside callback |

## 🌍 Real‑world Use Cases

- **Virtual DOM frameworks** (reactivity engines) track DOM inserts for hydration.
- **Lazy‑load images or ads** when new elements appear in viewport.
- **Auto‑layout / dashboards**: recompute charts when containers resize.
- **Accessibility tooling**: detect unexpected DOM mutations.

## 🛠️ Project Structure

```
poc-mutation-resize-observer/
├── index.html
├── style.css
├── package.json
└── src/
    └── main.js
```
