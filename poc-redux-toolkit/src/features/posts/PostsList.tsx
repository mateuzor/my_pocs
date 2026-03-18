import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, selectPosts } from './posts-slice';
import { AppDispatch } from '../../app/store';

export function PostsList() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error } = useSelector(selectPosts);

  // Dispatch the thunk on mount — only if we haven't fetched yet
  useEffect(() => {
    if (status === 'idle') dispatch(fetchPosts());
  }, [status, dispatch]);

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>Async Thunk — Fetch Posts</h3>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p style={{ color: 'red' }}>Error: {error}</p>}
      {status === 'succeeded' && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map((post) => (
            <li key={post.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
              <strong>{post.title}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
