import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

// Dependent queries: the second query has `enabled: !!userId`.
// It stays paused (no network request) until userId is truthy.
// This is how you chain queries that depend on the result of a previous one.

interface User {
  id: number;
  name: string;
  username: string;
}

interface Post {
  id: number;
  title: string;
  userId: number;
}

async function fetchUsers(): Promise<User[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/users?_limit=5');
  return res.json();
}

async function fetchPostsByUser(userId: number): Promise<Post[]> {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?userId=${userId}&_limit=5`
  );
  return res.json();
}

export function QueryDependent() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const { data: users, isLoading: loadingUsers } = useQuery<User[], Error>(
    ['users'],
    fetchUsers
  );

  // enabled: !!selectedUserId — query is paused when selectedUserId is null
  // As soon as selectedUserId becomes truthy, React Query fires the request
  const { data: posts, isLoading: loadingPosts, isFetching } = useQuery<Post[], Error>(
    ['posts-by-user', selectedUserId],
    () => fetchPostsByUser(selectedUserId!),
    { enabled: !!selectedUserId }
  );

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>React Query — Dependent Queries</h2>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        Posts query has <code>enabled: !!selectedUserId</code> — it only fires after a user is selected.
        Each user's posts are cached separately under <code>['posts-by-user', id]</code>.
      </p>

      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <div style={{ flex: '0 0 180px' }}>
          <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem' }}>Users</h4>
          {loadingUsers ? <p>Loading...</p> : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {users?.map(user => (
                <li
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  style={{
                    padding: '0.4rem 0.6rem',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    background: selectedUserId === user.id ? '#ebf8ff' : 'transparent',
                    fontSize: '0.9rem',
                    marginBottom: '2px',
                  }}
                >
                  {user.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem' }}>
            Posts{' '}
            {isFetching && <span style={{ fontSize: '0.75rem', color: '#718096' }}>fetching...</span>}
          </h4>
          {!selectedUserId && (
            <p style={{ color: '#a0aec0', fontSize: '0.9rem' }}>← Select a user</p>
          )}
          {loadingPosts && selectedUserId && <p>Loading posts...</p>}
          {posts && (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {posts.map(post => (
                <li key={post.id} style={{
                  padding: '0.4rem 0',
                  borderBottom: '1px solid #eee',
                  fontSize: '0.85rem',
                }}>
                  {post.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
