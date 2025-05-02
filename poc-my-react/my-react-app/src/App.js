export function App({ MyReact }) {
  const [count, setCount] = MyReact.useState(0);

  MyReact.useEffect(() => {
    console.log("useEffect: counter changed to", count);
  }, [count]);

  // Returns the VDOM structure using MyReact.createElement
  return MyReact.createElement(
    "div", // Parent element: <div>
    null, // No additional props
    MyReact.createElement("h1", null, `Counter: ${count}`),

    MyReact.createElement(
      "button",
      { onclick: () => setCount(count + 1) }, // Click event handler to increment counter
      "Increment"
    )
  );
}
