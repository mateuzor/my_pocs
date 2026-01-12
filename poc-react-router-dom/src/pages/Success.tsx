import { useLocation, useNavigate } from "react-router-dom";

/**
 * Página de sucesso que recebe state da navegação anterior.
 *
 * useLocation() retorna o objeto location que contém:
 * - pathname: caminho atual
 * - search: query string
 * - hash: fragmento da URL
 * - state: dados passados via navigate() ou Link
 */
export default function Success() {
  const location = useLocation();
  const navigate = useNavigate();

  // Acessando o state passado pela rota anterior
  const state = location.state as {
    plan?: string;
    price?: number;
    timestamp?: string;
  } | null;

  // Se não tem state, significa que acessou a página diretamente
  if (!state || !state.plan) {
    return (
      <div>
        <h1>Success Page</h1>
        <p style={{ color: "#666" }}>
          No order information found. This page should be accessed after completing a checkout.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "12px 24px",
            fontSize: 16,
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const orderDate = state.timestamp
    ? new Date(state.timestamp).toLocaleString()
    : "N/A";

  return (
    <div>
      <div
        style={{
          padding: 24,
          backgroundColor: "#d4edda",
          border: "1px solid #c3e6cb",
          borderRadius: 8,
          marginBottom: 24,
        }}
      >
        <h1 style={{ margin: 0, color: "#155724" }}>
          ✓ Order Confirmed!
        </h1>
        <p style={{ margin: "8px 0 0 0", color: "#155724" }}>
          Thank you for your purchase.
        </p>
      </div>

      <div
        style={{
          padding: 20,
          border: "1px solid #ddd",
          borderRadius: 8,
          backgroundColor: "#f8f9fa",
        }}
      >
        <h2>Order Details</h2>
        <div style={{ marginTop: 16 }}>
          <p>
            <strong>Plan:</strong> {state.plan}
          </p>
          <p>
            <strong>Price:</strong> ${state.price?.toFixed(2)} / month
          </p>
          <p>
            <strong>Order Date:</strong> {orderDate}
          </p>
        </div>
      </div>

      <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "12px 24px",
            fontSize: 16,
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Back to Dashboard
        </button>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "12px 24px",
            fontSize: 16,
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
