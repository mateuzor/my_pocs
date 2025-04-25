export default function Post({ title, post }) {
  return (
    <div style={{ padding: 20 }}>
      <h1>{title}</h1>
      <p>
        <strong>Post:</strong> {post.title}
      </p>
      <p>
        <strong>Timestamp:</strong> {post.timestamp}
      </p>
    </div>
  );
}
