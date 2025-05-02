// Stores state values (useState) between renders
let hooks = [];

// Index of the current hook being processed (reset on each render)
let currentHook = 0;

// Root component passed to render()
let rootComponent = null;

// Element where the app will be mounted (e.g., #root)
let rootContainer = null;

// Simulates the JSX function -> creates a VDOM structure
function createElement(type, props, ...children) {
  return { type, props: props || {}, children };
}

// Builds the real DOM from a VDOM node
function createDom(vdom) {
  // If it's text (string or number), create a text node
  if (typeof vdom === "string" || typeof vdom === "number") {
    return document.createTextNode(String(vdom));
  }

  const { type, props, children } = vdom;

  // If the type is a function (component), call it to get the actual VDOM
  if (typeof type === "function") {
    const componentVdom = type(props || {});
    return createDom(componentVdom); // Render the returned VDOM
  }

  // Create an HTML element with the tag (div, h1, etc.)
  const dom = document.createElement(type);

  // Apply props as DOM attributes (e.g., onClick, value...)
  Object.entries(props || {}).forEach(([key, value]) => {
    dom[key] = value;
  });

  // Add children recursively
  children.forEach((child) => {
    dom.appendChild(createDom(child));
  });

  return dom;
}

// Hook that maintains state across renders (useState)
function useState(initial) {
  const hookIndex = currentHook;

  // Initialize the value only on the first render
  if (hooks[hookIndex] === undefined) {
    hooks[hookIndex] = initial;
  }

  // Define a function to update the state and force a re-render
  const setState = (newVal) => {
    hooks[hookIndex] = newVal;
    internalRender(); // trigger a new render cycle
  };

  const state = hooks[hookIndex];
  currentHook++; // move to the next hook
  return [state, setState];
}

// Hook to simulate side effects (useEffect)
function useEffect(callback, dependencies) {
  const hookIndex = currentHook;

  // Check if dependencies have changed since the last render
  const hasChanged = dependencies
    ? !dependencies.every(
        (dependency, i) => dependency === hooks[hookIndex]?.dependencies?.[i]
      )
    : true;

  // If changed, save new callback/dependencies and execute the effect
  if (hasChanged) {
    hooks[hookIndex] = { callback, dependencies };
    setTimeout(callback); // simulate effect execution after paint (like React's useEffect)
  }

  currentHook++; // move to the next hook
}

// Renders the root component into the container (replaces previous content)
function internalRender() {
  currentHook = 0; // reset hook pointer before render
  const vdom = createElement(rootComponent); // get VDOM from root component
  const dom = createDom(vdom); // convert VDOM to real DOM
  rootContainer.innerHTML = ""; // clear previous DOM
  rootContainer.appendChild(dom); // insert new DOM
}

// createRoot: entry point to start rendering
function createRoot(container) {
  rootContainer = container; // save container reference

  return {
    render: (Component) => {
      rootComponent = Component; // save root component
      internalRender(); // execute first render
    },
  };
}

export const MyReact = {
  createElement,
  createRoot,
  useState,
  useEffect,
};
