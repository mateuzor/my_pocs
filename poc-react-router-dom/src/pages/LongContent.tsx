export default function LongContent() {
  return (
    <div>
      <h1>Long Content Page</h1>
      <p>
        Esta página tem conteúdo longo para demonstrar o comportamento de scroll
        restoration. Role até o final e navegue para outra página, depois volte.
      </p>

      {Array.from({ length: 50 }, (_, i) => (
        <div
          key={i}
          style={{
            padding: 20,
            margin: "16px 0",
            border: "1px solid #ddd",
            borderRadius: 8,
          }}
        >
          <h3>Section {i + 1}</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris.
          </p>
        </div>
      ))}

      <div
        style={{
          padding: 20,
          background: "#007bff",
          color: "white",
          borderRadius: 8,
          textAlign: "center",
        }}
      >
        <h2>🎉 You reached the bottom!</h2>
        <p>Now navigate to another page and come back to see scroll restoration in action.</p>
      </div>
    </div>
  );
}
