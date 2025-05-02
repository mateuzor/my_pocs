import("myReactLib/MyReact").then(({ MyReact }) => {
  import("./App.js").then(({ App }) => {
    const root = MyReact.createRoot(document.getElementById("root"));
    root.render(() => App({ MyReact }));
  });
});
