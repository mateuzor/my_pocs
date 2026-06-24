import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

// COMPONENT COMMUNICATION in Lit follows the platform convention:
// - data flows DOWN via properties/attributes
// - events flow UP via CustomEvent
//
// Child: emits a CustomEvent. `bubbles: true` lets it climb the tree and
// `composed: true` is REQUIRED for it to escape the shadow DOM boundary —
// without composed, the event would stay trapped inside this shadow root.
@customElement("mc-rating")
export class McRating extends LitElement {
  static styles = css`
    button { font-size: 1.2rem; background: none; border: none; cursor: pointer; }
  `;

  // Property binding target: parent sets .value down to highlight stars.
  @property({ type: Number })
  value = 0;

  private pick(n: number) {
    this.dispatchEvent(
      new CustomEvent<number>("rate-change", {
        detail: n,
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`${[1, 2, 3, 4, 5].map(
      (n) => html`<button @click=${() => this.pick(n)}>
        ${n <= this.value ? "★" : "☆"}
      </button>`,
    )}`;
  }
}

// Parent: listens for the bubbled event with @rate-change and feeds the new
// value back DOWN through the .value property binding (the dot tells lit-html
// to set a JS property, not an HTML attribute).
@customElement("mc-rating-panel")
export class McRatingPanel extends LitElement {
  @state()
  private rating = 3;

  render() {
    return html`
      <section>
        <h2>Rating: ${this.rating}/5</h2>
        <mc-rating
          .value=${this.rating}
          @rate-change=${(e: CustomEvent<number>) => (this.rating = e.detail)}
        ></mc-rating>
      </section>
    `;
  }
}
