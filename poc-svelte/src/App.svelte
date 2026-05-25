<script lang="ts">
  import Counter from './lib/Counter.svelte';
  import TodoList from './lib/TodoList.svelte';
  import Clock from './lib/Clock.svelte';
</script>

<main style="font-family: system-ui, sans-serif; padding: 2rem; max-width: 720px;">
  <h1>Svelte 5 POC</h1>
  <p style="color: #555;">
    Compile-time reactivity. The <code>.svelte</code> file is compiled into vanilla JS
    that updates the DOM directly — no virtual DOM, no diffing. With Svelte 5 runes,
    reactivity is explicit and works in any .ts file too.
  </p>

  <Counter />
  <TodoList />
  <Clock />
</main>
