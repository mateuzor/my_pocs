import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

// useMutation handles write operations (POST/PUT/DELETE).
// After a successful mutation, invalidateQueries marks the affected cache entries
// as stale, which triggers an automatic background refetch.

interface Post {
  id: number;
  title: string;
  body: string;
}

async function fetchPosts(): Promise<Post[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

async function createPost(title: string): Promise<Post> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body: 'Created via mutation', userId: 1 }),
  });
  return res.json();
}

export function QueryMutation() {
  const [title, setTitle] = useState('');
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery<Post[], Error>(
    ['posts-mutation'],
    fetchPosts
  );

  const mutation = useMutation(createPost, {
    onSuccess: (newPost) => {
      // Option 1: invalidate — React Query refetches the list automatically
      queryClient.invalidateQueries(['posts-mutation']);
      // Option 2 (alternative): update cache directly without a network round-trip
      // queryClient.setQueryData<Post[]>(['posts-mutation'], old => [newPost, ...(old ?? [])]);
      setTitle('');
    },
  });

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>React Query — useMutation + invalidateQueries</h2>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        POST creates a post on the server. <code>invalidateQueries</code> marks the list
        cache as stale, triggering an automatic refetch to keep the UI in sync.
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Post title..."
          style={{ padding: '0.4rem 0.75rem', flex: 1 }}
        />
        <button
          onClick={() => mutation.mutate(title)}
          disabled={!title.trim() || mutation.isLoading}
        >
          {mutation.isLoading ? 'Saving...' : 'Add Post'}
        </button>
      </div>

      {mutation.isError && (
        <p style={{ color: 'red', fontSize: '0.85rem' }}>
          Error: {(mutation.error as Error).message}
        </p>
      )}
      {mutation.isSuccess && (
        <p style={{ color: 'green', fontSize: '0.85rem' }}>
          Post created! (id: {mutation.data.id}) — list refetched automatically
        </p>
      )}

      {isLoading ? <p>Loading...</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {posts?.map(post => (
            <li key={post.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee', fontSize: '0.9rem' }}>
              <strong>#{post.id}</strong> {post.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
