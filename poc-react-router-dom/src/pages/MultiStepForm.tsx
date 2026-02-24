import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useState } from "react";

// ---------------------------------------------------------------------------
// Shared form data store (in a real app this would be context or global state)
// ---------------------------------------------------------------------------

interface FormData {
  // Step 1 — Personal info
  firstName: string;
  lastName: string;
  email: string;
  // Step 2 — Preferences
  plan: string;
  newsletter: boolean;
  // Step 3 — Review (read-only)
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  plan: "free",
  newsletter: false,
};

// ---------------------------------------------------------------------------
// Progress indicator
// ---------------------------------------------------------------------------

const steps = [
  { label: "Personal Info", path: "step-1" },
  { label: "Preferences", path: "step-2" },
  { label: "Review", path: "step-3" },
];

function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
        {/* Track line */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: 3,
            background: "#dee2e6",
            transform: "translateY(-50%)",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            height: 3,
            background: "#0d6efd",
            transform: "translateY(-50%)",
            zIndex: 1,
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            transition: "width 0.3s ease",
          }}
        />

        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isDone = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <div
              key={step.path}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: isDone ? "#198754" : isActive ? "#0d6efd" : "#dee2e6",
                  color: isDone || isActive ? "#fff" : "#6c757d",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  transition: "background 0.3s ease",
                }}
              >
                {isDone ? "✓" : stepNum}
              </div>
              <span
                style={{
                  marginTop: "0.4rem",
                  fontSize: "0.8rem",
                  color: isActive ? "#0d6efd" : "#6c757d",
                  fontWeight: isActive ? 600 : 400,
                  whiteSpace: "nowrap",
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 1 — Personal Info
// ---------------------------------------------------------------------------

function Step1({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
}) {
  const navigate = useNavigate();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("../step-2");
  };

  return (
    <form onSubmit={handleNext}>
      <h2>Step 1 — Personal Information</h2>
      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>First Name</label>
        <input
          style={inputStyle}
          type="text"
          value={data.firstName}
          onChange={(e) => onChange({ firstName: e.target.value })}
          required
          placeholder="Jane"
        />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>Last Name</label>
        <input
          style={inputStyle}
          type="text"
          value={data.lastName}
          onChange={(e) => onChange({ lastName: e.target.value })}
          required
          placeholder="Doe"
        />
      </div>
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={labelStyle}>Email</label>
        <input
          style={inputStyle}
          type="email"
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
          required
          placeholder="jane@example.com"
        />
      </div>
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <Link to="/multi-step-form" style={secondaryBtnStyle}>
          Cancel
        </Link>
        <button type="submit" style={primaryBtnStyle}>
          Next →
        </button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — Preferences
// ---------------------------------------------------------------------------

function Step2({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
}) {
  const navigate = useNavigate();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("../step-3");
  };

  return (
    <form onSubmit={handleNext}>
      <h2>Step 2 — Preferences</h2>
      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>Plan</label>
        <select
          style={inputStyle}
          value={data.plan}
          onChange={(e) => onChange({ plan: e.target.value })}
        >
          <option value="free">Free</option>
          <option value="pro">Pro — $9/mo</option>
          <option value="enterprise">Enterprise — $49/mo</option>
        </select>
      </div>
      <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <input
          id="newsletter"
          type="checkbox"
          checked={data.newsletter}
          onChange={(e) => onChange({ newsletter: e.target.checked })}
          style={{ width: 18, height: 18, cursor: "pointer" }}
        />
        <label htmlFor="newsletter" style={{ cursor: "pointer" }}>
          Subscribe to newsletter
        </label>
      </div>
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button
          type="button"
          onClick={() => navigate("../step-1")}
          style={secondaryBtnStyle}
        >
          ← Back
        </button>
        <button type="submit" style={primaryBtnStyle}>
          Next →
        </button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — Review & Submit
// ---------------------------------------------------------------------------

function Step3({
  data,
  onSubmit,
}: {
  data: FormData;
  onSubmit: () => void;
}) {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
    navigate("../complete");
  };

  const rows: [string, string][] = [
    ["First Name", data.firstName || "(empty)"],
    ["Last Name", data.lastName || "(empty)"],
    ["Email", data.email || "(empty)"],
    ["Plan", data.plan],
    ["Newsletter", data.newsletter ? "Yes" : "No"],
  ];

  return (
    <form onSubmit={handleSubmit}>
      <h2>Step 3 — Review</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label}>
              <td
                style={{
                  padding: "0.5rem 0.75rem",
                  border: "1px solid #dee2e6",
                  fontWeight: 600,
                  background: "#f8f9fa",
                  width: "40%",
                }}
              >
                {label}
              </td>
              <td style={{ padding: "0.5rem 0.75rem", border: "1px solid #dee2e6" }}>
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button
          type="button"
          onClick={() => navigate("../step-2")}
          style={secondaryBtnStyle}
        >
          ← Back
        </button>
        <button type="submit" style={{ ...primaryBtnStyle, background: "#198754" }}>
          Submit ✓
        </button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Completion screen
// ---------------------------------------------------------------------------

function CompletePage() {
  return (
    <div style={{ textAlign: "center", padding: "2rem 0" }}>
      <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🎉</div>
      <h2>Form Submitted!</h2>
      <p style={{ color: "#6c757d" }}>
        Thank you for completing the multi-step form demo.
      </p>
      <Link to="/multi-step-form" style={primaryBtnStyle}>
        Start over
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "0.3rem",
  fontWeight: 500,
  fontSize: "0.9rem",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem 0.75rem",
  border: "1px solid #ced4da",
  borderRadius: 6,
  fontSize: "1rem",
  boxSizing: "border-box",
};

const primaryBtnStyle: React.CSSProperties = {
  padding: "0.6rem 1.4rem",
  background: "#0d6efd",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: 600,
  textDecoration: "none",
  display: "inline-block",
};

const secondaryBtnStyle: React.CSSProperties = {
  padding: "0.6rem 1.4rem",
  background: "#e9ecef",
  color: "#333",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: "1rem",
  textDecoration: "none",
  display: "inline-block",
};

// ---------------------------------------------------------------------------
// Helper: determine current step number from pathname
// ---------------------------------------------------------------------------

function useCurrentStep() {
  const location = useLocation();
  if (location.pathname.includes("step-1")) return 1;
  if (location.pathname.includes("step-2")) return 2;
  if (location.pathname.includes("step-3")) return 3;
  return 0;
}

// ---------------------------------------------------------------------------
// Main exported component
// ---------------------------------------------------------------------------

export default function MultiStepForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const currentStep = useCurrentStep();
  const location = useLocation();

  const handleChange = (patch: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  const handleSubmit = () => {
    // In a real app: POST to API here
    console.log("Form submitted:", formData);
  };

  const isComplete = location.pathname.includes("complete");
  const isLanding =
    location.pathname === "/multi-step-form" ||
    location.pathname === "/multi-step-form/";

  return (
    <div style={{ padding: "2rem", maxWidth: 560, margin: "0 auto" }}>
      <h1>Multi-Step Form</h1>

      {!isComplete && !isLanding && <ProgressBar currentStep={currentStep} />}

      {isLanding && (
        <div>
          <p style={{ color: "#666", marginBottom: "1.5rem" }}>
            This demo shows a 3-step form where each step lives at its own route
            (<code>/multi-step-form/step-1</code>,{" "}
            <code>/multi-step-form/step-2</code>,{" "}
            <code>/multi-step-form/step-3</code>). The URL reflects the current
            step, enabling deep linking and browser back/forward navigation
            between steps.
          </p>
          <Link to="step-1" style={primaryBtnStyle}>
            Start Form →
          </Link>
        </div>
      )}

      <Routes>
        <Route index element={null} />
        <Route
          path="step-1"
          element={<Step1 data={formData} onChange={handleChange} />}
        />
        <Route
          path="step-2"
          element={<Step2 data={formData} onChange={handleChange} />}
        />
        <Route
          path="step-3"
          element={<Step3 data={formData} onSubmit={handleSubmit} />}
        />
        <Route path="complete" element={<CompletePage />} />
        <Route path="*" element={<Navigate to="/multi-step-form" replace />} />
      </Routes>
    </div>
  );
}
