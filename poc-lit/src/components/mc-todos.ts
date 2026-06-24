import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { when } from "lit/directives/when.js";
import { classMap } from "lit/directives/class-map.js";

// lit-html TEMPLATES + DIRECTIVES — templates are tagged template literals.
// Directives are functions that customize how an expression renders:
// - repeat(): keyed list rendering (reorders DOM by key instead of re-creating)
// - when(): conditional rendering without ternary noise
// - classMap(): toggle CSS classes from an object
interface Todo {
  id: number;
  text: string;
  done: boolean;
}

@customElement("mc-todos")
export class McTodos extends LitElement {
  @state()
  private todos: Todo[] = [
    { id: 1, text: "Train legs", done: true },
    { id: 2, text: "Hit protein target", done: false },
  ];

  private toggle(id: number) {
    this.todos = this.todos.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t,
    );
  }

  render() {
    const remaining = this.todos.filter((t) => !t.done).length;
    return html`
      <section>
        <h2>Todos (${remaining} left)</h2>
        <ul>
          ${repeat(
            this.todos,
            (t) => t.id, // key — keeps DOM stable across reorders
            (t) => html`
              <li
                class=${classMap({ done: t.done })}
                @click=${() => this.toggle(t.id)}
              >
                ${t.text}
              </li>
            `,
          )}
        </ul>
        ${when(
          remaining === 0,
          () => html`<p>✅ all done</p>`,
          () => html`<p>keep going</p>`,
        )}
      </section>
    `;
  }
}
