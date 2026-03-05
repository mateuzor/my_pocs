import useSWR, { mutate } from 'swr';
import { useState } from 'react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const TODOS_KEY = 'https://jsonplaceholder.typicode.com/todos?_limit=5';

const fetcher = (url: string): Promise<Todo[]> => fetch(url).then(r => r.json());

async function toggleTodoAPI(todo: Todo): Promise<Todo> {
  // Simulate network delay to make the optimistic update visible
  await new Promise(r => setTimeout(r, 600));
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${todo.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: !todo.completed }),
  });
  return res.json();
}

export function SWRMutationDemo() {
  const { data: todos, isLoading } = useSWR<Todo[]>(TODOS_KEY, fetcher);
  const [pending, setPending] = useState<number | null>(null);

  const handleToggle = async (todo: Todo) => {
    setPending(todo.id);

    // mutate() with optimisticData updates the cache immediately before the API responds
    // rollbackOnError: true restores original data if the API call fails
    await mutate(
      TODOS_KEY,
      async (current: Todo[] | undefined) => {
        await toggleTodoAPI(todo);
        return current?.map(t =>
          t.id === todo.id ? { ...t, completed: !t.completed } : t
        );
      },
      {
        // optimisticData: what to show immediately while the API is in flight
        optimisticData: todos?.map(t =>
          t.id === todo.id ? { ...t, completed: !t.completed } : t
        ),
        rollbackOnError: true, // revert cache if API call fails
        revalidate: false,     // skip background refetch after mutation
      }
    );

    setPending(null);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>SWR — Mutation + Optimistic UI</h3>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        Click a todo — UI updates instantly, then syncs with the server.
      </p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos?.map((todo) => (
          <li
            key={todo.id}
            onClick={() => handleToggle(todo)}
            style={{
              padding: '0.6rem',
              borderBottom: '1px solid #eee',
              cursor: 'pointer',
              opacity: pending === todo.id ? 0.5 : 1,
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? '#aaa' : '#000',
            }}
          >
            {todo.completed ? '✓' : '○'} {todo.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
