import { useState } from 'react';
import { useSWRConfig } from 'swr';
import { addTodo, toggleTodo, Todo } from '../api';
import { useTodos } from '../hooks';

export function Todos() {
  const { data, error, isLoading, isValidating, mutate } = useTodos();
  const [text, setText] = useState('');

  // Optimistic update: show the new item immediately, then let SWR
  // revalidate. If the server fails, SWR rolls back to the previous data.
  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    const optimistic: Todo = { id: -1, text, done: false };
    setText('');
    try {
      await mutate(
        async (current) => {
          const created = await addTodo(optimistic.text);
          return [...(current ?? []), created];
        },
        { optimisticData: (current) => [...(current ?? []), optimistic], rollbackOnError: true, revalidate: false },
      );
    } catch (err) {
      alert((err as Error).message + ' (rolled back). Tip: type "fail" to test.');
    }
  }

  async function onToggle(id: number) {
    await mutate(
      async (current) => {
        await toggleTodo(id);
        return current?.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
      },
      { optimisticData: (current) => current?.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) ?? [], revalidate: true },
    );
  }

  if (isLoading) return <p>Loading todos...</p>;
  if (error) return <p>Error: {String(error)}</p>;

  return (
    <section>
      <h2>Todos (optimistic mutate) {isValidating && <small>revalidating...</small>}</h2>
      <ul>
        {data?.map((t) => (
          <li key={t.id} style={{ opacity: t.id === -1 ? 0.5 : 1 }}>
            <label>
              <input type="checkbox" checked={t.done} onChange={() => onToggle(t.id)} />
              {t.text}
            </label>
          </li>
        ))}
      </ul>
      <form onSubmit={onAdd}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="New todo" />
        <button disabled={!text}>Add</button>
      </form>
    </section>
  );
}

// Global mutate by key: invalidate from anywhere without the hook.
export function RefreshButton() {
  const { mutate } = useSWRConfig();
  return <button onClick={() => mutate('/api/todos')}>Revalidate todos globally</button>;
}
