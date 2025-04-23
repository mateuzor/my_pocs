export function App({ MyReact }) {
  const [count, setCount] = MyReact.useState(0);

  MyReact.useEffect(() => {
    console.log("useEffect: contador mudou para", count);
  }, [count]);

  // Retorna a estrutura VDOM utilizando MyReact.createElement
  return MyReact.createElement(
    "div", // Elemento pai: <div>
    null, // Sem props adicionais
    MyReact.createElement("h1", null, `Counter: ${count}`),

    MyReact.createElement(
      "button",
      { onclick: () => setCount(count + 1) }, // Evento de clique que incrementa o contador
      "Increment"
    )
  );
}
