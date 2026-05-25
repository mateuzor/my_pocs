<script lang="ts">
  interface Todo {
    id: number;
    text: string;
    done: boolean;
  }

  // $state on an array — Svelte tracks mutations like .push/.splice automatically.
  // No need to spread into a new array (though you still can if you prefer).
  let todos = $state<Todo[]>([
    { id: 1, text: 'Learn Svelte 5 runes', done: true },
    { id: 2, text: 'Write POC', done: false },
  ]);
  let draft = $state('');

  // Derived value — automatically recomputes when todos change
  const remaining = $derived(todos.filter((t) => !t.done).length);

  function addTodo() {
    const text = draft.trim();
    if (!text) return;
    todos.push({ id: Date.now(), text, done: false });
    draft = '';
  }

  function toggle(id: number) {
    const todo = todos.find((t) => t.id === id);
    if (todo) todo.done = !todo.done; // mutation works because $state is reactive
  }
</script>

<section>
  <h2>List rendering with {'{#each}'}</h2>
  <p style="color: #555">{remaining} remaining</p>

  <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
    <!-- bind:value is two-way binding — input value ⇄ draft variable -->
    <input
      bind:value={draft}
      onkeydown={(e) => e.key === 'Enter' && addTodo()}
      placeholder="New todo..."
    />
    <button onclick={addTodo}>Add</button>
  </div>

  <!-- {#each} is Svelte's loop. The `(todo.id)` is the key — required for stable
       updates when items reorder. -->
  <ul style="list-style: none; padding: 0;">
    {#each todos as todo (todo.id)}
      <li
        style="
          padding: 0.4rem 0;
          border-bottom: 1px solid #eee;
          text-decoration: {todo.done ? 'line-through' : 'none'};
          color: {todo.done ? '#a0aec0' : 'inherit'};
          cursor: pointer;
        "
        onclick={() => toggle(todo.id)}
      >
        {todo.text}
      </li>
    {/each}
  </ul>

  <!-- {#if} is the conditional block — equivalent to React's {cond && ...} -->
  {#if remaining === 0}
    <p style="color: green;">🎉 All done!</p>
  {/if}
</section>
