// <template> is parsed once and cloned for each instance: cheaper than setting innerHTML every time.
const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host { display: inline-block; }
    span {
      padding: .15rem .6rem; font-size: .8rem; color: white;
      border-radius: var(--ui-badge-radius, 4px);
      background: var(--_bg, #64748b);
    }
    :host([variant="success"]) span { --_bg: #16a34a; }
    :host([variant="danger"]) span { --_bg: #dc2626; }
  </style>
  <span part="label"><slot></slot></span>
`;

export class UiBadge extends HTMLElement {
  constructor() {
    super();
    // Shadow DOM encapsulates markup and CSS; "open" keeps it inspectable and testable.
    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
  }
}

// Names must contain a dash so they can never collide with future HTML elements.
customElements.define('ui-badge', UiBadge);
