import { Link, useLocation } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "6rem",
          fontWeight: 900,
          color: "#dee2e6",
          lineHeight: 1,
          marginBottom: "0.5rem",
        }}
      >
        404
      </div>

      <h1 style={{ fontSize: "1.75rem", margin: "0 0 0.5rem" }}>
        Page Not Found
      </h1>

      <p style={{ color: "#6c757d", maxWidth: 420, marginBottom: "0.5rem" }}>
        The page you are looking for does not exist or has been moved.
      </p>

      <code
        style={{
          background: "#f8f9fa",
          border: "1px solid #dee2e6",
          borderRadius: 4,
          padding: "0.2rem 0.6rem",
          fontSize: "0.85rem",
          color: "#e83e8c",
          marginBottom: "2rem",
        }}
      >
        {location.pathname}
      </code>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          to="/"
          style={{
            padding: "0.6rem 1.4rem",
            background: "#0d6efd",
            color: "#fff",
            borderRadius: 6,
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Go Home
        </Link>
        <button
          onClick={() => window.history.back()}
          style={{
            padding: "0.6rem 1.4rem",
            background: "#e9ecef",
            color: "#333",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
