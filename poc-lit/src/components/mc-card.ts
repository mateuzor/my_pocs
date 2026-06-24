import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

// SHADOW DOM — by default each LitElement renders into its own shadow root.
// Two consequences this demo highlights:
// 1. STYLE ENCAPSULATION: the `css` below applies ONLY inside this component.
//    The bare `h3`/`:host` selectors can't leak out or be overridden by page
//    CSS. No BEM, no CSS-in-JS runtime — the platform scopes it.
// 2. SLOTS: <slot> projects light-DOM children from the page into the shadow
//    tree, so consumers compose content while the component owns the chrome.
@customElement("mc-card")
export class McCard extends LitElement {
  static styles = css`
    /* :host targets the custom element itself from inside the shadow root. */
    :host {
      display: block;
      border: 1px solid #d0d0d0;
      border-radius: 12px;
      padding: 1rem;
      margin: 0.5rem 0;
    }
    h3 {
      margin: 0 0 0.5rem;
      color: #6b21a8;
    }
    /* ::slotted styles projected children (only top-level matches). */
    ::slotted(strong) {
      color: #be123c;
    }
  `;

  render() {
    return html`
      <h3><slot name="title">Untitled</slot></h3>
      <!-- Default (unnamed) slot for the body content. -->
      <slot></slot>
    `;
  }
}
