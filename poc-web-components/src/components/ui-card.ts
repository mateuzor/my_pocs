const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host { display: block; }
    /* :host-context-free approach: variables with fallbacks keep the component themable. */
    .card { border: 1px solid var(--ui-card-border, #cbd5e1); border-radius: 8px; background: white; overflow: hidden; }
    header { padding: .75rem 1rem; font-weight: 600; background: #f1f5f9; }
    .body { padding: 1rem; }
    footer { padding: .5rem 1rem; text-align: right; }
    /* Hide the footer when no action was slotted. */
    footer:has(slot[name="actions"]:not([data-has])) { display: none; }
  </style>
  <!-- part="..." makes these elements stylable from outside with ::part(name). -->
  <div class="card" part="container">
    <header part="header"><slot name="title">Untitled</slot></header>
    <div class="body" part="body"><slot></slot></div>
    <footer part="footer"><slot name="actions"></slot></footer>
  </div>
`;

export class UiCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    // slotchange fires when projected nodes change, so the component reacts to its children.
    const actions = this.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="actions"]')!;
    const sync = () => actions.toggleAttribute('data-has', actions.assignedNodes().length > 0);
    actions.addEventListener('slotchange', sync);
    sync();
  }
}

customElements.define('ui-card', UiCard);
