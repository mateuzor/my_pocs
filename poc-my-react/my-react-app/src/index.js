// Importa dinamicamente a biblioteca MyReact do módulo remoto via Module Federation
import("myReactLib/MyReact").then(({ MyReact }) => {
  // Importa dinamicamente o componente App
  import("./App.js").then(({ App }) => {
    // Seleciona o container da DOM onde o app será renderizado
    const container = document.getElementById("root");

    // Define a função de renderização de todo o app
    const doRender = () => {
      MyReact.render(
        MyReact.createElement(App, { MyReact }), // passa MyReact como prop para o App
        container
      );
    };

    // Registra a função de renderização dentro da lib (para ser chamada após um setState)
    MyReact.__internalSetRerender(doRender);

    // Renderização inicial
    doRender();
  });
});
