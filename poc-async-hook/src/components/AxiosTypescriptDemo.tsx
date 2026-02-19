import { useState } from 'react';
import axios, { AxiosResponse } from 'axios';

// --- Domain types ---
interface User { id: number; name: string; email: string; phone: string; website: string; }
interface Post { id: number; title: string; body: string; userId: number; }
interface Comment { id: number; postId: number; name: string; email: string; body: string; }

// --- Generic API wrapper ---
// T = response type, B = request body type
async function apiGet<T>(url: string): Promise<T> {
  const res: AxiosResponse<T> = await axios.get(url);
  return res.data; // TypeScript knows res.data is T
}

async function apiPost<T, B = unknown>(url: string, body: B): Promise<T> {
  const res: AxiosResponse<T> = await axios.post(url, body);
  return res.data;
}

// --- Typed API service layer ---
const BASE = 'https://jsonplaceholder.typicode.com';

const UserService = {
  getAll: () => apiGet<User[]>(`${BASE}/users`),
  getById: (id: number) => apiGet<User>(`${BASE}/users/${id}`),
};

const PostService = {
  getByUser: (userId: number) => apiGet<Post[]>(`${BASE}/posts?userId=${userId}`),
  create: (post: Omit<Post, 'id'>) => apiPost<Post, Omit<Post, 'id'>>(`${BASE}/posts`, post),
};

const CommentService = {
  getByPost: (postId: number) => apiGet<Comment[]>(`${BASE}/comments?postId=${postId}`),
};

export default function AxiosTypescriptDemo() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [postComments, setPostComments] = useState<Comment[]>([]);
  const [createdPost, setCreatedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading('users');
    const data = await UserService.getAll(); // TypeScript: data is User[]
    setUsers(data);
    setLoading(null);
  };

  const selectUser = async (user: User) => {
    setSelectedUser(user);
    setUserPosts([]);
    setPostComments([]);
    setLoading('posts');
    const posts = await PostService.getByUser(user.id); // TypeScript: posts is Post[]
    setUserPosts(posts);
    setLoading(null);
  };

  const loadComments = async (post: Post) => {
    setLoading('comments');
    const comments = await CommentService.getByPost(post.id); // TypeScript: comments is Comment[]
    setPostComments(comments.slice(0, 3));
    setLoading(null);
  };

  const createPost = async () => {
    if (!selectedUser) return;
    setLoading('create');
    const newPost = await PostService.create({
      title: `Post by ${selectedUser.name}`,
      body: 'This post was created via typed axios POST.',
      userId: selectedUser.id,
    });
    setCreatedPost(newPost); // TypeScript: newPost is Post
    setLoading(null);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Axios + TypeScript Generics</h1>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
        <strong>Pattern:</strong> Generic wrapper functions (<code>apiGet&lt;T&gt;</code>, <code>apiPost&lt;T, B&gt;</code>)
        + typed service layer = full type safety without any <code>any</code>.
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={loadUsers} disabled={!!loading}
          style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '4px' }}>
          {loading === 'users' ? 'Loading...' : '1. Load Users'}
        </button>
        {selectedUser && (
          <button onClick={createPost} disabled={!!loading}
            style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#388e3c', color: 'white', border: 'none', borderRadius: '4px' }}>
            {loading === 'create' ? 'Creating...' : '3. Create Post'}
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Users */}
        {users.length > 0 && (
          <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0 }}>Users <span style={{ fontSize: '12px', color: '#666' }}>User[]</span></h3>
            {users.slice(0, 5).map(u => (
              <div key={u.id} onClick={() => selectUser(u)}
                style={{ padding: '8px', marginBottom: '6px', cursor: 'pointer', borderRadius: '4px',
                  backgroundColor: selectedUser?.id === u.id ? '#1976d2' : 'white',
                  color: selectedUser?.id === u.id ? 'white' : 'black' }}>
                <strong>{u.name}</strong>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>{u.email}</div>
              </div>
            ))}
            <p style={{ fontSize: '12px', color: '#666', marginBottom: 0 }}>2. Click user to load posts</p>
          </div>
        )}

        {/* Posts */}
        {userPosts.length > 0 && (
          <div style={{ padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0 }}>Posts <span style={{ fontSize: '12px', color: '#666' }}>Post[]</span></h3>
            {loading === 'posts' ? <p>Loading...</p> : userPosts.slice(0, 4).map(p => (
              <div key={p.id} onClick={() => loadComments(p)}
                style={{ padding: '8px', marginBottom: '6px', cursor: 'pointer', backgroundColor: 'white', borderRadius: '4px', fontSize: '13px' }}>
                {p.title}
              </div>
            ))}
            <p style={{ fontSize: '12px', color: '#666', marginBottom: 0 }}>Click post to see comments</p>
          </div>
        )}

        {/* Comments */}
        {postComments.length > 0 && (
          <div style={{ padding: '15px', backgroundColor: '#fce4ec', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0 }}>Comments <span style={{ fontSize: '12px', color: '#666' }}>Comment[]</span></h3>
            {postComments.map(c => (
              <div key={c.id} style={{ padding: '8px', marginBottom: '6px', backgroundColor: 'white', borderRadius: '4px', fontSize: '13px' }}>
                <strong>{c.name}</strong>
                <div style={{ color: '#666', fontSize: '12px' }}>{c.body.slice(0, 60)}...</div>
              </div>
            ))}
          </div>
        )}

        {/* Created post */}
        {createdPost && (
          <div style={{ padding: '15px', backgroundColor: '#f3e5f5', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0 }}>Created Post <span style={{ fontSize: '12px', color: '#666' }}>Post</span></h3>
            <p><strong>ID:</strong> {createdPost.id}</p>
            <p><strong>Title:</strong> {createdPost.title}</p>
            <p><strong>UserId:</strong> {createdPost.userId}</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <h3>TypeScript + Axios patterns:</h3>
        <ul>
          <li><strong>AxiosResponse&lt;T&gt;</strong> — typed response wrapper</li>
          <li><strong>apiGet&lt;T&gt;(url)</strong> — generic function, T inferred at call site</li>
          <li><strong>Service layer</strong> — encapsulates endpoints, centralizes types</li>
          <li><strong>Omit&lt;Post, 'id'&gt;</strong> — utility type for create payloads (no id yet)</li>
          <li><strong>Zero any</strong> — full type safety from API call to UI render</li>
        </ul>
      </div>
    </div>
  );
}
