import { useNavigate } from "react-router-dom";
import { useState } from "react";

/**
 * Dashboard que demonstra navegação programática com state.
 *
 * useNavigate() permite navegar imperativamente e passar state entre rotas.
 * Útil para fluxos como checkout, wizards, confirmações, etc.
 */
export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("basic");

  const plans = [
    { id: "basic", name: "Basic Plan", price: 9.99 },
    { id: "pro", name: "Pro Plan", price: 19.99 },
    { id: "enterprise", name: "Enterprise Plan", price: 49.99 },
  ];

  const handleCheckout = () => {
    const plan = plans.find((p) => p.id === selectedPlan);

    // Navega para /success passando dados via state
    navigate("/success", {
      state: {
        plan: plan?.name,
        price: plan?.price,
        timestamp: new Date().toISOString(),
      },
    });
  };

  return (
    <div>
      <h1>Dashboard - Choose Your Plan</h1>
      <p>
        Este exemplo demonstra <strong>useNavigate()</strong> com passagem de
        state entre rotas.
      </p>

      <div style={{ marginTop: 24 }}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            style={{
              padding: 16,
              marginBottom: 12,
              border: selectedPlan === plan.id ? "2px solid #007bff" : "1px solid #ddd",
              borderRadius: 8,
              cursor: "pointer",
              backgroundColor: selectedPlan === plan.id ? "#e7f3ff" : "transparent",
            }}
            onClick={() => setSelectedPlan(plan.id)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: 0 }}>{plan.name}</h3>
                <p style={{ margin: "4px 0", fontSize: 14, color: "#666" }}>
                  Perfect for {plan.id === "basic" ? "individuals" : plan.id === "pro" ? "small teams" : "large organizations"}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 24, fontWeight: "bold", margin: 0 }}>
                  ${plan.price}
                </p>
                <p style={{ fontSize: 12, color: "#666", margin: 0 }}>per month</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleCheckout}
        style={{
          marginTop: 24,
          padding: "12px 32px",
          fontSize: 16,
          fontWeight: "bold",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
