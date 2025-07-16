import React from "react";
import facts from "../data";

const App = () =>
  facts.map((fact, i) => (
    <div className="card">
      <p key={i}>{fact.fact}</p>
    </div>
  ));

export default App;
