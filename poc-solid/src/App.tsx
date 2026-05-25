import { createSignal, createMemo, createEffect, For, Show, onCleanup } from 'solid-js';

// Solid.js looks like React but works fundamentally differently.
//
// In REACT: when state changes, the WHOLE component function re-runs,
// the virtual DOM diffs, and the framework patches the real DOM.
//
// In SOLID: the component function runs ONCE at mount. State is read through
// `signals` — a getter function. The JSX compiler tracks WHICH expressions
// read which signals. When a signal changes, only the specific DOM nodes
// that depend on it are updated. No re-renders, no virtual DOM, no diffing.
//
// This is called "fine-grained reactivity" and it's the same idea behind
// Svelte (compile-time) and Preact Signals (library-level).

function Counter() {
  // createSignal returns a tuple of [getter, setter].
  // `count` is a FUNCTION you call to read the value, not a value.
  // That's how Solid tracks which DOM nodes depend on it.
  const [count, setCount] = createSignal(0);

  // createMemo = derived value. The function is re-run only when its inputs
  // change. Conceptually identical to React's useMemo but without a deps array.
  const doubled = createMemo(() => count() * 2);

  // createEffect = react to signal changes. Runs once on mount and again
  // every time any signal it reads changes. No deps array — Solid tracks them.
  createEffect(() => {
    console.log(`count is now ${count()}`);
  });

  return (
    <section style={{ 'margin-bottom': '2rem' }}>
      <h2>Signals + memos</h2>
      <p>
        Count: <strong>{count()}</strong> · Doubled: <strong>{doubled()}</strong>
      </p>
      <button onClick={() => setCount(count() + 1)}>+1</button>{' '}
      <button onClick={() => setCount((c) => c - 1)}>−1</button>
    </section>
  );
}

function TodoList() {
  // Signals can hold any value, including arrays / objects.
  const [todos, setTodos] = createSignal<{ id: number; text: string; done: boolean }[]>([
    { id: 1, text: 'Learn Solid', done: true },
    { id: 2, text: 'Write POC', done: false },
  ]);
  const [draft, setDraft] = createSignal('');

  const remaining = createMemo(() => todos().filter((t) => !t.done).length);

  function addTodo() {
    const text = draft().trim();
    if (!text) return;
    setTodos([...todos(), { id: Date.now(), text, done: false }]);
    setDraft('');
  }

  function toggle(id: number) {
    setTodos(todos().map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  return (
    <section>
      <h2>List rendering with &lt;For&gt;</h2>
      <p style={{ color: '#555' }}>{remaining()} remaining</p>

      <div style={{ display: 'flex', gap: '0.5rem', 'margin-bottom': '0.75rem' }}>
        <input
          value={draft()}
          onInput={(e) => setDraft(e.currentTarget.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="New todo..."
        />
        <button onClick={addTodo}>Add</button>
      </div>

      {/* <For> is Solid's keyed list rendering primitive.
          Unlike .map(), <For> only touches the DOM nodes that actually changed.
          When you reorder or update one item, only that item's DOM is patched. */}
      <ul style={{ 'list-style': 'none', padding: 0 }}>
        <For each={todos()}>
          {(todo) => (
            <li
              style={{
                padding: '0.4rem 0',
                'border-bottom': '1px solid #eee',
                'text-decoration': todo.done ? 'line-through' : 'none',
                color: todo.done ? '#a0aec0' : 'inherit',
                cursor: 'pointer',
              }}
              onClick={() => toggle(todo.id)}
            >
              {todo.text}
            </li>
          )}
        </For>
      </ul>

      {/* <Show> is the conditional primitive — equivalent to {cond && ...} but
          tracks the reactive boundary explicitly */}
      <Show when={remaining() === 0}>
        <p style={{ color: 'green' }}>🎉 All done!</p>
      </Show>
    </section>
  );
}

function Clock() {
  // Side effects clean up automatically via onCleanup — equivalent to React's
  // useEffect cleanup function.
  const [now, setNow] = createSignal(new Date());

  const id = setInterval(() => setNow(new Date()), 1000);
  onCleanup(() => clearInterval(id));

  return (
    <section style={{ 'margin-top': '2rem' }}>
      <h2>Effect cleanup</h2>
      <p style={{ 'font-variant-numeric': 'tabular-nums' }}>
        Current time: <strong>{now().toLocaleTimeString()}</strong>
      </p>
      <p style={{ color: '#555', 'font-size': '0.9rem' }}>
        onCleanup tears down the interval when this component unmounts.
      </p>
    </section>
  );
}

export function App() {
  return (
    <main style={{ 'font-family': 'system-ui, sans-serif', padding: '2rem', 'max-width': 720 }}>
      <h1>Solid.js POC</h1>
      <p style={{ color: '#555' }}>
        Fine-grained reactivity — no virtual DOM, no re-renders. Each signal
        update touches only the specific DOM nodes that depend on it.
      </p>
      <Counter />
      <TodoList />
      <Clock />
    </main>
  );
}
