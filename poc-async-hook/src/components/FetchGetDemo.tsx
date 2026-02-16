import { useState, useEffect } from 'react';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  company: { name: string };
}

export default function FetchGetDemo() {
  const [post, setPost] = useState<Post | null>(null);
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [postId, setPostId] = useState(1);

  // Basic GET - single resource
  const fetchPost = async (id: number) => {
    setPostLoading(true);
    setPostError(null);
    setPost(null);

    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    const data = await res.json();
    setPost(data);
    setPostLoading(false);
  };

  // GET on mount - list of resources
  useEffect(() => {
    const fetchUsers = async () => {
      setUsersLoading(true);
      setUsersError(null);

      const res = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await res.json();
      setUsers(data);
      setUsersLoading(false);
    };

    fetchUsers();
  }, []);

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Fetch API - GET Requests</h1>

      {/* Manual GET with param */}
      <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
        <h2>GET Single Resource</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', alignItems: 'center' }}>
          <label>Post ID:</label>
          <input
            type="number"
            value={postId}
            min={1}
            max={100}
            onChange={e => setPostId(Number(e.target.value))}
            style={{ padding: '8px', width: '80px' }}
          />
          <button
            onClick={() => fetchPost(postId)}
            disabled={postLoading}
            style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            {postLoading ? 'Loading...' : 'Fetch Post'}
          </button>
        </div>

        {postError && <p style={{ color: 'red' }}>Error: {postError}</p>}
        {post && (
          <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '4px' }}>
            <p><strong>ID:</strong> {post.id}</p>
            <p><strong>Title:</strong> {post.title}</p>
            <p><strong>Body:</strong> {post.body}</p>
          </div>
        )}
      </div>

      {/* Auto GET on mount */}
      <div style={{ padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
        <h2>GET List (auto on mount)</h2>
        {usersLoading && <p>Loading users...</p>}
        {usersError && <p style={{ color: 'red' }}>Error: {usersError}</p>}
        <div style={{ display: 'grid', gap: '10px' }}>
          {users.map(user => (
            <div key={user.id} style={{ backgroundColor: 'white', padding: '12px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong>{user.name}</strong>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{user.email}</p>
              </div>
              <span style={{ color: '#999', fontSize: '13px' }}>{user.company.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <h3>Fetch GET patterns:</h3>
        <ul>
          <li><strong>fetch(url)</strong> - returns a Promise with Response object</li>
          <li><strong>res.json()</strong> - parses response body as JSON</li>
          <li><strong>useEffect</strong> - trigger fetch on mount or dependency change</li>
          <li><strong>Manual trigger</strong> - call fetch function on user action</li>
        </ul>
      </div>
    </div>
  );
}
