import { useState, lazy, Suspense } from "react";
import "./App.css";
// import HeavyComponent from "./components/HeavyComponent";

const HeavyComponent = lazy(() => import("./components/HeavyComponent")); // dynamic import for code splitting

function App() {
  const [showCharts, setShowCharts] = useState(false);

  return (
    <>
      <h1>Home Page</h1>
      // fallback will render when the component is being get
      <Suspense fallback={<h3>...Loading</h3>}>
        {" "}
        {showCharts && <HeavyComponent />}
      </Suspense>
      {/* {showCharts && <HeavyComponent />} */}
      <button onClick={() => setShowCharts(!showCharts)}>
        {showCharts ? "Hide Charts" : "Show Charts"}
      </button>
    </>
  );
}

export default App;
