// Armazena os valores de estado (useState) entre renders
let hooks = [];

// Índice do hook atual sendo processado (resetado a cada render)
let currentHook = 0;

// Função que o app consumidor registra para forçar re-render
let rerenderFn = null;

// Exporta o "React" feito do zero com a mesma API base
export const MyReact = {
  createElement,
  render,
  useState,
  useEffect,
  __internalSetRerender,
};

// Permite o app consumidor registrar a função de re-render
function __internalSetRerender(fn) {
  rerenderFn = fn;
}

// Simula a função JSX -> cria uma estrutura VDOM
function createElement(type, props, ...children) {
  return { type, props: props || {}, children };
}

// Função que renderiza o VDOM na DOM real
function render(vdom, container) {
  container.innerHTML = ""; // Limpa o conteúdo anterior
  currentHook = 0; // Reseta o índice dos hooks para novo render
  // Não limpa hooks[] para manter o estado entre renders

  const dom = createDom(vdom); // Constrói a árvore DOM a partir do VDOM
  container.appendChild(dom); // Adiciona na página
}

// Constrói o DOM real a partir de um nó VDOM
function createDom(vdom) {
  // Se for texto (string ou número), cria nó de texto
  if (typeof vdom === "string" || typeof vdom === "number") {
    return document.createTextNode(String(vdom));
  }

  const { type, props, children } = vdom;

  // Se o tipo for uma função (componente), executa ele para obter o VDOM real
  if (typeof type === "function") {
    const componentVdom = type(props);
    return createDom(componentVdom); // Renderiza o VDOM retornado
  }

  // Cria um elemento HTML com a tag (div, h1, etc)
  const dom = document.createElement(type);

  // Aplica as props como atributos do DOM (ex: onClick, value...)
  Object.entries(props || {}).forEach(([key, value]) => {
    dom[key] = value;
  });

  // Adiciona os filhos recursivamente
  children.forEach((child) => {
    dom.appendChild(createDom(child));
  });

  return dom;
}

// Hook que mantém o estado entre renders (useState)
function useState(initial) {
  const hookIndex = currentHook;

  // Inicializa o valor apenas no primeiro render
  if (hooks[hookIndex] === undefined) {
    hooks[hookIndex] = initial;
  }

  // Define a função que atualiza o estado e força novo render
  const setState = (newVal) => {
    hooks[hookIndex] = newVal;
    rerenderFn?.(); // chama a função de re-render registrada pelo app
  };

  const state = hooks[hookIndex];
  currentHook++; // passa pro próximo hook
  return [state, setState];
}

// Hook que simula side effects (useEffect)
function useEffect(callback, dependencies) {
  const hookIndex = currentHook;

  // Verifica se as dependências mudaram desde o último render
  const hasChanged = dependencies
    ? !dependencies.every(
        (dependency, i) => dependency === hooks[hookIndex]?.dependencies?.[i]
      )
    : true;

  // Se mudou, salva novo callback/dependencies e executa o efeito
  if (hasChanged) {
    hooks[hookIndex] = { callback, dependencies };
    setTimeout(callback); // simula execução após render
  }

  currentHook++; // passa pro próximo hook
}
