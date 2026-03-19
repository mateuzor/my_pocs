import { useState } from 'react';
import { useTodoStore } from './useTodoStore';

export function TodoZustand() {
  const { todos, addTodo, toggleTodo, removeTodo, clearDone } = useTodoStore();
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (!input.trim()) return;
    addTodo(input.trim());
    setInput('');
  };

  const done = todos.filter((t) => t.done).length;

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>Zustand — Todo with Persist</h3>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>Todos survive page refresh — stored in localStorage via persist middleware.</p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add a todo..."
          style={{ flex: 1, padding: '0.4rem' }}
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map((todo) => (
          <li key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0', borderBottom: '1px solid #eee' }}>
            <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(todo.id)} />
            <span style={{ flex: 1, textDecoration: todo.done ? 'line-through' : 'none', color: todo.done ? '#aaa' : '#000' }}>
              {todo.text}
            </span>
            <button onClick={() => removeTodo(todo.id)} style={{ fontSize: '0.8rem' }}>✕</button>
          </li>
        ))}
      </ul>

      {done > 0 && (
        <button onClick={clearDone} style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
          Clear {done} completed
        </button>
      )}
    </div>
  );
}
