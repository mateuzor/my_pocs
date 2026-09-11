const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host { display: inline-flex; gap: .5rem; align-items: center; }
    button { width: 2rem; height: 2rem; }
    output { min-width: 2ch; text-align: center; }
  </style>
  <span id="label"></span>
  <button id="dec" aria-label="Decrement">-</button>
  <output id="out"></output>
  <button id="inc" aria-label="Increment">+</button>
`;

export class UiCounter extends HTMLElement {
  // Only attributes listed here trigger attributeChangedCallback.
  static observedAttributes = ['value', 'step', 'label'];

  #value = 0;
  #step = 1;
  #root: ShadowRoot;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
    this.#root.appendChild(template.content.cloneNode(true));
    this.#root.getElementById('inc')!.addEventListener('click', () => this.#change(+this.#step));
    this.#root.getElementById('dec')!.addEventListener('click', () => this.#change(-this.#step));
  }

  // Attributes are strings (HTML side); properties are typed values (JS side).
  // Exposing both, kept in sync, is what makes a component usable from markup and from code.
  get value() { return this.#value; }
  set value(v: number) {
    this.#value = Number(v);
    // Reflect property -> attribute so CSS selectors like [value="3"] keep working.
    this.setAttribute('value', String(this.#value));
    this.#render();
  }

  get step() { return this.#step; }
  set step(v: number) { this.#step = Number(v) || 1; }

  attributeChangedCallback(name: string, _old: string | null, next: string | null) {
    if (name === 'value') {
      const n = Number(next);
      if (n !== this.#value) { this.#value = n; this.#render(); }
    }
    if (name === 'step') this.#step = Number(next) || 1;
    if (name === 'label') this.#root.getElementById('label')!.textContent = next ?? '';
  }

  connectedCallback() { this.#render(); }

  #change(delta: number) {
    this.value = this.#value + delta;
    // Custom events are the output channel; bubbles+composed lets them cross the shadow boundary.
    this.dispatchEvent(new CustomEvent('change', { detail: { value: this.#value }, bubbles: true, composed: true }));
  }

  #render() {
    this.#root.getElementById('out')!.textContent = String(this.#value);
  }
}

customElements.define('ui-counter', UiCounter);

// Teach TypeScript about the tag so querySelector('ui-counter') is typed.
declare global {
  interface HTMLElementTagNameMap { 'ui-counter': UiCounter }
}
