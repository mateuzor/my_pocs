import React from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import BuggyComponent from "./BuggyComponent";
import FallbackRenderDemo from "./FallbackRenderDemo";

export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <h1>React Error Boundary Demo</h1>
      <ErrorBoundary>
        <BuggyComponent />
      </ErrorBoundary>
      <FallbackRenderDemo />
    </div>
  );
}
