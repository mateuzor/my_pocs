import { useState, useEffect } from 'react';
import axios from 'axios';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface Comment {
  id: number;
  name: string;
  email: string;
  body: string;
}

// axios instance with base config
const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

export default function AxiosGetDemo() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  const [postId, setPostId] = useState(1);
  const [post, setPost] = useState<Post | null>(null);
  const [postLoading, setPostLoading] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  // GET list on mount
  useEffect(() => {
    api.get<Post[]>('/posts', { params: { _limit: 5 } })
      .then(res => {
        // axios puts data in res.data — no need to call .json()!
        setPosts(res.data);
      })
      .finally(() => setPostsLoading(false));
  }, []);

  // GET single post
  const fetchPost = async (id: number) => {
    setPostLoading(true);
    setPost(null);
    setComments([]);

    // Parallel requests with axios.all
    setCommentsLoading(true);
    const [postRes, commentsRes] = await Promise.all([
      api.get<Post>(`/posts/${id}`),
      api.get<Comment[]>(`/posts/${id}/comments`),
    ]);

    setPost(postRes.data);
    setComments(commentsRes.data);
    setPostLoading(false);
    setCommentsLoading(false);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Axios - GET Requests</h1>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
        <strong>Fetch vs Axios — key difference:</strong>
        <ul style={{ marginTop: '8px', marginBottom: 0 }}>
          <li>fetch → <code>res.json()</code> to get data; axios → <code>res.data</code> directly</li>
          <li>fetch → must check <code>res.ok</code>; axios → throws on 4xx/5xx automatically</li>
          <li>axios → built-in timeout, baseURL, default headers</li>
        </ul>
      </div>

      {/* List */}
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
        <h2>GET /posts (auto on mount)</h2>
        {postsLoading ? <p>Loading...</p> : posts.map(p => (
          <div key={p.id} style={{ padding: '8px', borderBottom: '1px solid #ccc', fontSize: '14px' }}>
            <strong>#{p.id}</strong> {p.title}
          </div>
        ))}
      </div>

      {/* Single + parallel */}
      <div style={{ padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
        <h2>Parallel GET (post + comments)</h2>
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
            style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#388e3c', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            {postLoading ? 'Loading...' : 'Fetch Post + Comments'}
          </button>
        </div>

        {post && (
          <div style={{ marginBottom: '15px', padding: '12px', backgroundColor: 'white', borderRadius: '4px' }}>
            <strong>{post.title}</strong>
            <p style={{ margin: '5px 0 0', color: '#555', fontSize: '14px' }}>{post.body}</p>
          </div>
        )}

        {commentsLoading && <p>Loading comments...</p>}
        {comments.slice(0, 3).map(c => (
          <div key={c.id} style={{ padding: '8px', borderLeft: '3px solid #4CAF50', marginBottom: '8px', fontSize: '13px' }}>
            <strong>{c.name}</strong> — {c.email}
            <p style={{ margin: '4px 0 0', color: '#666' }}>{c.body}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <h3>Axios GET features used:</h3>
        <ul>
          <li><strong>axios.create()</strong> — instance with baseURL, timeout, headers preset</li>
          <li><strong>api.get&lt;T&gt;(url)</strong> — typed response, data in <code>res.data</code></li>
          <li><strong>params</strong> — query string as object: <code>{'{ _limit: 5 }'}</code></li>
          <li><strong>Promise.all</strong> — parallel requests, same as fetch</li>
        </ul>
      </div>
    </div>
  );
}
