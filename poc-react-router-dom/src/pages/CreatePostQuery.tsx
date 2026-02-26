import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface NewPost {
  title: string;
  body: string;
  userId: number;
}

interface Post extends NewPost {
  id: number;
}

async function createPost(newPost: NewPost): Promise<Post> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newPost),
  });
  if (!res.ok) throw new Error('Failed to create post');
  return res.json();
}

export function CreatePostQuery() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const mutation = useMutation({
    mutationFn: createPost,

    // onSuccess runs after the API responds successfully
    onSuccess: (createdPost) => {
      // Invalidate posts cache so the list refetches on next visit
      queryClient.invalidateQueries({ queryKey: ['posts'] });

      // Navigate to success page, passing the created post via router state
      navigate('/mutation-success', { state: { post: createdPost } });
    },

    onError: (error) => {
      console.error('Mutation failed:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ title, body, userId: 1 });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px' }}>
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ display: 'block', width: '100%', padding: '0.5rem' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            style={{ display: 'block', width: '100%', padding: '0.5rem' }}
            rows={4}
            required
          />
        </div>
        {/* Disable the button while the request is in flight */}
        <button
          type="submit"
          disabled={mutation.isPending}
          style={{ padding: '0.5rem 1.5rem' }}
        >
          {mutation.isPending ? 'Creating...' : 'Create Post'}
        </button>
        {mutation.isError && (
          <p style={{ color: 'red' }}>Error: {(mutation.error as Error).message}</p>
        )}
      </form>
    </div>
  );
}
