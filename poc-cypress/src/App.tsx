import { useState } from 'react';

// Simple app to give the Cypress tests something to interact with:
// - A todo list with add/toggle/delete
// - A "fetch user" button that calls an API (we'll intercept it in tests)

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
}

export function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [draft, setDraft] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  function addTodo() {
    if (!draft.trim()) return;
    setTodos([...todos, { id: Date.now(), text: draft.trim(), done: false }]);
    setDraft('');
  }

  function toggle(id: number) {
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function remove(id: number) {
    setTodos(todos.filter((t) => t.id !== id));
  }

  async function fetchUser() {
    setLoading(true);
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/users/1');
      setUser(await res.json());
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: 600 }}>
      <h1>Cypress POC</h1>

      <section>
        <h2>Todos</h2>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {/* data-cy attributes are stable selectors for Cypress.
              Avoid using CSS classes or text content — they change with styling. */}
          <input
            data-cy="todo-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            placeholder="New todo..."
          />
          <button data-cy="todo-add" onClick={addTodo}>Add</button>
        </div>

        <ul data-cy="todo-list" style={{ listStyle: 'none', padding: 0 }}>
          {todos.map((todo) => (
            <li
              key={todo.id}
              data-cy="todo-item"
              data-done={todo.done}
              style={{
                padding: '0.5rem 0',
                borderBottom: '1px solid #eee',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <input
                type="checkbox"
                data-cy="todo-toggle"
                checked={todo.done}
                onChange={() => toggle(todo.id)}
              />
              <span
                data-cy="todo-text"
                style={{
                  flex: 1,
                  textDecoration: todo.done ? 'line-through' : 'none',
                  color: todo.done ? '#a0aec0' : 'inherit',
                }}
              >
                {todo.text}
              </span>
              <button data-cy="todo-remove" onClick={() => remove(todo.id)}>
                ×
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Fetch user</h2>
        <button data-cy="fetch-user" onClick={fetchUser} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch user #1'}
        </button>
        {user && (
          <div data-cy="user-card" style={{ marginTop: '0.75rem' }}>
            <strong>{user.name}</strong>
            <div style={{ color: '#555' }}>{user.email}</div>
          </div>
        )}
      </section>
    </main>
  );
}
