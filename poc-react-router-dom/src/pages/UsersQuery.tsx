import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

// Unique key that identifies this query in the cache
const USERS_QUERY_KEY = ['users'] as const;

async function fetchUsers(): Promise<User[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
}

export function UsersQuery() {
  // useQuery handles loading, error and caching automatically
  const { data: users, isLoading, isError, error, isFetching } = useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: fetchUsers,
  });

  if (isLoading) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Users (TanStack Query)</h2>
        <p>Loading users...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Users (TanStack Query)</h2>
        <p style={{ color: 'red' }}>Error: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Users (TanStack Query)</h2>
      {/* isFetching is true during background refetches — data already exists in cache */}
      {isFetching && <small style={{ color: '#888' }}>Refreshing...</small>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {users?.map((user) => (
          <li key={user.id} style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>
            <Link to={`/users-query/${user.id}`} style={{ textDecoration: 'none' }}>
              <strong>{user.name}</strong> — {user.email}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
