import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

async function fetchPost(id: string): Promise<Post> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  if (!res.ok) throw new Error('Post not found');
  return res.json();
}

export function PostDetailQuery() {
  const { postId } = useParams<{ postId: string }>();
  const queryClient = useQueryClient();

  const { data: post, isLoading, isFetching } = useQuery({
    queryKey: ['posts', Number(postId)], // same key used in prefetchQuery — cache hit!
    queryFn: () => fetchPost(postId!),
    enabled: !!postId,
  });

  // Check if this post was already in cache (e.g. prefetched on hover)
  const wasPrefetched =
    queryClient.getQueryState(['posts', Number(postId)])?.dataUpdatedAt !== undefined;

  if (isLoading) return <p style={{ padding: '2rem' }}>Loading post...</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '700px' }}>
      <Link to="/posts-list" style={{ color: '#0070f3' }}>← Back to Posts</Link>

      {/* Indicate when data came from cache rather than a new network request */}
      {wasPrefetched && !isFetching && (
        <p style={{ color: '#4caf50', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          ⚡ Loaded from cache (prefetched on hover)
        </p>
      )}

      <h2>{post?.title}</h2>
      <p style={{ lineHeight: '1.6', color: '#444' }}>{post?.body}</p>

      {/* Navigate between posts — already-visited ones load instantly from cache */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        {Number(postId) > 1 && (
          <Link to={`/posts/${Number(postId) - 1}`}>← Post {Number(postId) - 1}</Link>
        )}
        {Number(postId) < 10 && (
          <Link to={`/posts/${Number(postId) + 1}`}>Post {Number(postId) + 1} →</Link>
        )}
      </div>
    </div>
  );
}
