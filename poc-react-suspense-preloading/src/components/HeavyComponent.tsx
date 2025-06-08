export default function HeavyComponent() {
  return (
    <div style={{ padding: 20, border: "1px solid gray" }}>
      <h2>This is a heavy component</h2>
      <p>Loaded on demand with React.lazy and preloaded on hover.</p>
    </div>
  );
}
