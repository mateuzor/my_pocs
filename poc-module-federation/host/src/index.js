import React from "react";
import ReactDOM from "react-dom";

const App = React.lazy(() => import("./App"));

const Root = () => (
  <React.Suspense fallback={<div>Loading...</div>}>
    <App />
  </React.Suspense>
);

ReactDOM.render(<Root />, document.getElementById("root"));
