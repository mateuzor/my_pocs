// Import React
import React from "react";

export default function App() {
  // Function that simulates an error when the button is clicked
  const throwError = () => {
    throw new Error("Simulated error for Sentry"); // This will be caught by Sentry in production
  };

  return (
    <div style={{ fontFamily: "Arial", padding: "2rem" }}>
      <h1>POC: Observability with Sentry, Web Vitals, LogRocket & Clarity</h1>
      {/* Button that triggers the simulated error */}
      <button onClick={throwError} style={{ marginTop: "1rem" }}>
        Trigger Error
      </button>
    </div>
  );
}
