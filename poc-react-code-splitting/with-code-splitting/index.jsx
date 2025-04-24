
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";

const HeavyComponent = React.lazy(() => import("./HeavyComponent"));

const App = () => (
  <div>
    <h1>With Code Splitting</h1>
    <Suspense fallback={<div>Loading chart...</div>}>
      <HeavyComponent />
    </Suspense>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
