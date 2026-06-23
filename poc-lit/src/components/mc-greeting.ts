import { LitElement, html, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";

// REACTIVE PROPERTIES — @property exposes a field as a public HTML attribute.
// <mc-greeting name="Mateus" step="2"> sets these from markup, and changing
// the attribute (or the JS property) triggers a re-render. `type` tells Lit
// how to deserialize the string attribute into a JS value.
@customElement("mc-greeting")
export class McGreeting extends LitElement {
  @property({ type: String })
  name = "world";

  @property({ type: Number })
  step = 1;

  // @state stays internal — not reflected to an attribute.
  @state()
  private clicks = 0;

  // LIFECYCLE — willUpdate runs before render whenever reactive props change.
  // Great place to derive values or guard. `changedProps` maps prop -> old value.
  protected willUpdate(changedProps: PropertyValues<this>) {
    if (changedProps.has("name")) {
      this.name = this.name.trim() || "world";
    }
  }

  render() {
    return html`
      <section>
        <h2>Hello, ${this.name}!</h2>
        <p>clicked ${this.clicks} times (step ${this.step})</p>
        <button @click=${() => (this.clicks += this.step)}>+${this.step}</button>
      </section>
    `;
  }
}
