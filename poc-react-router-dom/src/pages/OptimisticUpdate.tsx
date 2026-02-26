import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=8');
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

async function toggleTodo(todo: Todo): Promise<Todo> {
  // Artificial delay so the optimistic update is visible during the demo
  await new Promise((r) => setTimeout(r, 800));
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${todo.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: !todo.completed }),
  });
  if (!res.ok) throw new Error('Update failed');
  return res.json();
}

const TODOS_KEY = ['todos'] as const;

export function OptimisticUpdate() {
  const queryClient = useQueryClient();

  const { data: todos, isLoading } = useQuery({
    queryKey: TODOS_KEY,
    queryFn: fetchTodos,
  });

  const mutation = useMutation({
    mutationFn: toggleTodo,

    // onMutate runs before the API call — update the UI immediately
    onMutate: async (todoToToggle) => {
      // Cancel in-flight refetches to prevent them from overwriting our optimistic state
      await queryClient.cancelQueries({ queryKey: TODOS_KEY });

      // Snapshot current cache so we can restore it if the request fails
      const previousTodos = queryClient.getQueryData<Todo[]>(TODOS_KEY);

      // Apply optimistic change directly to the cache
      queryClient.setQueryData<Todo[]>(TODOS_KEY, (old) =>
        old?.map((t) =>
          t.id === todoToToggle.id ? { ...t, completed: !t.completed } : t
        )
      );

      return { previousTodos };
    },

    // onError receives the context from onMutate — used here to roll back
    onError: (_err, _todo, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(TODOS_KEY, context.previousTodos);
      }
    },

    // onSettled fires after either success or error — sync with the server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_KEY });
    },
  });

  if (isLoading) return <p style={{ padding: '2rem' }}>Loading todos...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Optimistic Updates</h2>
      <p style={{ color: '#888', fontSize: '0.9rem' }}>
        Click to toggle — UI updates instantly, then syncs with server
      </p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos?.map((todo) => (
          <li
            key={todo.id}
            onClick={() => mutation.mutate(todo)}
            style={{
              padding: '0.75rem',
              borderBottom: '1px solid #eee',
              cursor: 'pointer',
              opacity: mutation.isPending ? 0.7 : 1,
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? '#888' : '#000',
            }}
          >
            {todo.completed ? '✓ ' : '○ '}{todo.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
