const React = require("react");

function App() {
  return React.createElement(
    "div",
    { style: { padding: "2rem", fontFamily: "Arial, sans-serif" } },
    React.createElement("h1", null, "Progressive Hydration Demo"),
    React.createElement("p", null, "Scroll down to see chunks loading"),

    React.createElement(
      "div",
      {
        id: "island-1",
        "data-island": "island1",
        style: {
          margin: "2rem 0",
          padding: "2rem",
          border: "2px dashed #ccc",
          textAlign: "center",
          backgroundColor: "#f9f9f9",
        },
      },
      React.createElement(
        "button",
        {
          disabled: true,
          style: {
            padding: "1rem 2rem",
            fontSize: "16px",
            backgroundColor: "#45a049",
            color: "#999",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "not-allowed",
          },
        },
        "Island1 - Not Interactive (0)"
      )
    ),

    React.createElement(
      "div",
      {
        style: {
          height: "100vh",
          backgroundColor: "#eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      },
      React.createElement("p", null, "Scroll down...")
    ),

    React.createElement(
      "div",
      {
        id: "island-2",
        "data-island": "island2",
        style: {
          margin: "2rem 0",
          padding: "2rem",
          border: "2px dashed #ccc",
          textAlign: "center",
          backgroundColor: "#f9f9f9",
        },
      },
      React.createElement(
        "button",
        {
          disabled: true,
          style: {
            padding: "1rem 2rem",
            fontSize: "16px",
            backgroundColor: "#ddd",
            color: "#999",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "not-allowed",
          },
        },
        "Island2 - Not Interactive (0)"
      )
    )
  );
}

module.exports = App;
