# 🧱 POC 12: React Error Boundary (Robust Error Handling)

This POC demonstrates how to implement a **robust, reusable Error Boundary component in React**, including real-world use cases, fallback UI customization, error logging, and support for nested boundaries.

---

## 🧠 What is an Error Boundary?

An **Error Boundary** is a special type of React component that **catches JavaScript errors** in its child component tree, **logs those errors**, and **displays a fallback UI** instead of breaking the entire app.

Error boundaries only catch errors in:

- Rendering lifecycle (render, constructor, componentDidMount)
- Inside class components or descendants
- Not async functions or event handlers (you must handle those separately)

---

## ⚠️ Why Class Components?

React Error Boundaries **must be implemented using class components** because they rely on two lifecycle methods that are not available in function components:

- `static getDerivedStateFromError(error)`
- `componentDidCatch(error, info)`

Function components with hooks do **not** have access to these methods. Therefore, error boundaries cannot be built with hooks alone. Some third-party libraries (like `react-error-boundary`) offer a `useErrorBoundary` hook, but internally they still wrap a class component under the hood.

---

## ✅ Features in this POC

- Custom `ErrorBoundary` component with lifecycle handling
- Fallback UI with reset button
- Nested boundaries support
- Logging error to the console or external service (e.g., Sentry, LogRocket)
- Integration with real components that throw errors

---

## 📁 Project Structure

```
/poc-error-boundary
│── /src
│   ├── App.js               # Parent component using ErrorBoundary
│   ├── ErrorBoundary.js     # Custom error boundary logic
│   ├── BuggyComponent.js    # Simulated error-throwing component
│   ├── NestedComponent.js   # Optional: component wrapped by another boundary
│   └── index.js             # Entry point
```

---

## 🔧 ErrorBoundary Component (class-based)

```js
import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary caught an error]:", error);
    // Optionally send to monitoring service like Sentry
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, background: "#ffe6e6" }}>
          <h2>Something went wrong.</h2>
          <pre>{this.state.error?.toString()}</pre>
          <button onClick={this.reset}>Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

---

## 🧪 Example Usage

```js
import React from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import BuggyComponent from "./BuggyComponent";

function App() {
  return (
    <div>
      <h1>Error Boundary Demo</h1>
      <ErrorBoundary>
        <BuggyComponent />
      </ErrorBoundary>
    </div>
  );
}
```

---

## 💥 Simulating Errors

```js
import React, { useState } from "react";

export default function BuggyComponent() {
  const [explode, setExplode] = useState(false);
  if (explode) throw new Error("💣 Boom! Component crashed!");

  return <button onClick={() => setExplode(true)}>Trigger Error</button>;
}
```

---

## 🧱 Nested Boundaries (Optional Use Case)

```js
<ErrorBoundary>
  <ComponentA />
  <ErrorBoundary>
    <ComponentB />
  </ErrorBoundary>
</ErrorBoundary>
```

Useful when only one part of the UI should fail without affecting others.

---

## 📊 Real-World Use Cases

- **Payment forms**: isolate Stripe/PayPal modules from crashing the full checkout
- **Widgets or third-party components**: wrap plugins individually
- **User dashboards**: allow one broken widget without crashing entire page
- **Lazy-loaded routes**: fallback error display when dynamic imports fail

---

## 📦 Improvements / Next Steps

- Add support for logging to external services (e.g. Sentry)
- Add React 18 support using `useErrorBoundary()` from 3rd-party libs
- Turn fallback into a reusable component with dynamic messages / retry logic

---

✅ Built to understand and apply robust error handling in production-ready React apps.]
