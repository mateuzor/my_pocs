import { useLocation, Link } from 'react-router-dom';

export function MutationSuccess() {
  // Read the post data passed via navigate state
  const { state } = useLocation();
  const post = state?.post;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Post Created!</h2>
      {post && (
        <div style={{ background: '#f0fff0', padding: '1rem', borderRadius: '8px' }}>
          <p><strong>ID:</strong> {post.id}</p>
          <p><strong>Title:</strong> {post.title}</p>
        </div>
      )}
      <Link to="/create-post">← Create another</Link>
    </div>
  );
}
