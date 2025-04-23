# Build Your Own React (POC)

This is a minimalist library built from scratch that simulates the core behavior of React, with support for:

✅ `createElement()` (similar to JSX)  
✅ `render()` to mount the VDOM into the real DOM  
✅ `useState()` for state management  
✅ `useEffect()` for basic side effects  
✅ Manual re-rendering via `__internalSetRerender`  
✅ Used component in another project via **Module Federation**

---

## Project Structure

This project is split into two parts:

```
root/
├── my-react-lib/         # My React Lib
│   ├── src/
│   │   └── myReact.js     # The actual library
│   ├── index.js           # Entry point (used only to activate Webpack dev server)
│   ├── index.html         # Simple confirmation page
│   └── webpack.config.js  # Exposes the lib via Module Federation
│
└── my-react-app/         # Consumer application that uses the library
    ├── src/
    │   ├── App.js
    │   └── index.js
    ├── index.html
    └── webpack.config.js  # Loads the lib remotely using Module Federation
```

---

## How the Library Works (myReact.js)

### `createElement(type, props, ...children)`

Simulates JSX compilation. Returns a Virtual DOM node like:

```js
{
  type: "div",
  props: { onClick: ... },
  children: [...]
}
```

### `render(vdom, container)`

- Clears the container's DOM
- Resets the internal hook index
- Builds real DOM recursively from VDOM
- Appends the result to the DOM

### `useState(initial)`

- Keeps the value in an internal `hooks[]` array indexed by `currentHook`
- Returns `[state, setState]`
- `setState()` updates the value and calls the re-render function registered by the consumer

### `useEffect(callback, deps)`

- Executes the callback if dependencies change
- Uses `setTimeout()` to simulate delayed side effects

---

## How Module Federation is Configured

### `my-react-lib/webpack.config.js`

```js
new ModuleFederationPlugin({
  name: 'myReactLib',
  filename: 'remoteEntry.js',
  exposes: {
    './MyReact': './src/myReact.js',
  },
}),
```

This exposes your lib on `http://localhost:3001/remoteEntry.js`.

### `my-react-app/webpack.config.js`

```js
new ModuleFederationPlugin({
  name: 'myReactApp',
  remotes: {
    myReactLib: 'myReactLib@http://localhost:3001/remoteEntry.js',
  },
}),
```

This makes the lib available inside the app as `import('myReactLib/MyReact')`.

---

## 🚀 How to Run Locally

### 1. Install dependencies and running both projects:

```bash
cd my-react-lib
npm install
npx webpack serve
```

This will run on [http://localhost:3001](http://localhost:3001)

```
cd ..
cd my-react-app
npm install
npx webpack serve
```

This will run on [http://localhost:3002](http://localhost:3002)

---

## 🧪 How the App Uses the Library

### `my-react-app/src/index.js`

```js
import("myReactLib/MyReact").then(({ MyReact }) => {
  import("./App.js").then(({ App }) => {
    const container = document.getElementById("root");

    const doRender = () => {
      MyReact.render(MyReact.createElement(App, { MyReact }), container);
    };

    MyReact.__internalSetRerender(doRender);
    doRender();
  });
});
```

### `App.js`

```js
export function App({ MyReact }) {
  const [count, setCount] = MyReact.useState(0);

  return MyReact.createElement(
    "div",
    null,
    MyReact.createElement("h1", null, "Count: ", count),
    MyReact.createElement(
      "button",
      { onclick: () => setCount(count + 1) },
      "Increment"
    )
  );
}
```

---

## 🎯 Goal

This project aims to **understand how React works under the hood**, by building a working library from scratch using core concepts: VDOM, hooks, manual re-rendering, and modular consumption via Module Federation.

---
