import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

interface Post {
  id: number;
  title: string;
  userId: number;
}

async function fetchPosts(): Promise<Post[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

async function fetchPostDetail(id: number) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  if (!res.ok) throw new Error('Not found');
  return res.json();
}

export function PostsListQuery() {
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  // Warm the cache when the user hovers over a link
  // When they click through, the detail page loads instantly from cache
  const handleHover = (postId: number) => {
    queryClient.prefetchQuery({
      queryKey: ['posts', postId],
      queryFn: () => fetchPostDetail(postId),
      staleTime: 1000 * 60, // skip prefetch if data was already cached within 1 min
    });
  };

  if (isLoading) return <p style={{ padding: '2rem' }}>Loading posts...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Posts (with Prefetching)</h2>
      <p style={{ color: '#888', fontSize: '0.9rem' }}>Hover over a post to prefetch its detail</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts?.map((post) => (
          <li key={post.id} style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>
            <Link
              to={`/posts/${post.id}`}
              onMouseEnter={() => handleHover(post.id)}
              style={{ textDecoration: 'none', color: '#0070f3' }}
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
