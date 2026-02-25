import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
}

async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  if (!res.ok) throw new Error('User not found');
  return res.json();
}

async function fetchUserPosts(userId: string): Promise<Post[]> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export function UserDetailsQuery() {
  const { userId } = useParams<{ userId: string }>();

  // Primary query — fetch the user by id
  const userQuery = useQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUser(userId!),
    enabled: !!userId,
  });

  // Dependent query — only fires after userQuery succeeds
  // enabled: false blocks execution until the dependency is ready
  const postsQuery = useQuery({
    queryKey: ['users', userId, 'posts'],
    queryFn: () => fetchUserPosts(userId!),
    enabled: !!userQuery.data,
  });

  if (userQuery.isLoading) return <p>Loading user...</p>;
  if (userQuery.isError) return <p>Error: {(userQuery.error as Error).message}</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <Link to="/users-query">← Back to Users</Link>
      <h2>{userQuery.data?.name}</h2>
      <p>Email: {userQuery.data?.email}</p>
      <p>Phone: {userQuery.data?.phone}</p>

      <h3>Posts</h3>
      {/* Posts query only runs after user data is available */}
      {postsQuery.isLoading && <p>Loading posts...</p>}
      {postsQuery.data?.slice(0, 3).map((post) => (
        <div key={post.id} style={{ marginBottom: '1rem', padding: '1rem', background: '#f9f9f9' }}>
          <strong>{post.title}</strong>
          <p style={{ color: '#555', fontSize: '0.9rem' }}>{post.body}</p>
        </div>
      ))}
    </div>
  );
}
