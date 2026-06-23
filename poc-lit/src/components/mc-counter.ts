import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";

// A LitElement is a Web Component. @customElement registers <mc-counter> with
// the browser's CustomElementRegistry — no framework needed to render it.
// `render()` returns a lit-html template; Lit re-renders it efficiently
// whenever a reactive property changes.
@customElement("mc-counter")
export class McCounter extends LitElement {
  // @state = internal reactive property. Changing it schedules a re-render,
  // but it is NOT exposed as an HTML attribute (private to the component).
  @state()
  private count = 0;

  render() {
    return html`
      <section>
        <h2>Counter element</h2>
        <p>${this.count}</p>
        <button @click=${() => this.count++}>increment</button>
      </section>
    `;
  }
}
