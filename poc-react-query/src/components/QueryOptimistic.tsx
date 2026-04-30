import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Optimistic updates: update the cache immediately before the server responds.
// If the request fails, onError rolls back to the previous snapshot.
// This makes the UI feel instant even on slow networks.

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=6');
  return res.json();
}

async function toggleTodo(todo: Todo): Promise<Todo> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${todo.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...todo, completed: !todo.completed }),
  });
  return res.json();
}

export function QueryOptimistic() {
  const queryClient = useQueryClient();
  const { data: todos, isLoading } = useQuery<Todo[], Error>(
    ['todos-optimistic'],
    fetchTodos
  );

  const mutation = useMutation(toggleTodo, {
    // onMutate runs BEFORE the request — apply the optimistic change immediately
    onMutate: async (updatedTodo) => {
      // Cancel any outgoing refetches so they don't overwrite the optimistic state
      await queryClient.cancelQueries(['todos-optimistic']);
      // Save the current cache value so we can roll back on error
      const previous = queryClient.getQueryData<Todo[]>(['todos-optimistic']);
      // Apply the optimistic update directly to the cache
      queryClient.setQueryData<Todo[]>(['todos-optimistic'], old =>
        old?.map(t => t.id === updatedTodo.id ? { ...t, completed: !t.completed } : t)
      );
      // Return snapshot as context so onError can use it
      return { previous };
    },
    // onError receives the context returned by onMutate — restore the snapshot
    onError: (_err, _vars, context: any) => {
      queryClient.setQueryData(['todos-optimistic'], context?.previous);
    },
    // onSettled always runs — sync with the real server state
    onSettled: () => {
      queryClient.invalidateQueries(['todos-optimistic']);
    },
  });

  if (isLoading) return <p style={{ padding: '1.5rem' }}>Loading...</p>;

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>React Query — Optimistic Updates</h2>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        Click a todo — the checkbox toggles <em>before</em> the server responds.
        On error, the change automatically rolls back.
      </p>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos?.map(todo => (
          <li
            key={todo.id}
            onClick={() => mutation.mutate(todo)}
            style={{
              padding: '0.6rem 0.75rem',
              borderBottom: '1px solid #eee',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '0.9rem',
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? '#a0aec0' : 'inherit',
              borderRadius: '4px',
            }}
          >
            <span style={{ fontSize: '1rem' }}>{todo.completed ? '✓' : '○'}</span>
            {todo.title}
          </li>
        ))}
      </ul>

      <p style={{ fontSize: '0.8rem', color: '#718096', marginTop: '0.5rem' }}>
        onMutate → optimistic update → request → onError rollback / onSettled refetch
      </p>
    </div>
  );
}
