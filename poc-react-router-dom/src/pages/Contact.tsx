import { Form, useActionData, useNavigation } from "react-router-dom";

/**
 * Página de contato usando action function.
 *
 * - Form (do React Router): substitui <form>, não precisa preventDefault
 * - useActionData(): retorna o resultado do action após submit
 * - useNavigation(): informa o estado (idle, submitting, loading)
 */
export default function Contact() {
  const actionData = useActionData() as
    | { success: boolean; message?: string; error?: string }
    | undefined;

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div>
      <h1>Contact Us</h1>
      <p>
        Este formulário usa <strong>action function</strong> para processar a
        submissão sem precisar de useState/onSubmit.
      </p>

      <Form
        method="post"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          maxWidth: 500,
          marginTop: 24,
        }}
      >
        <div>
          <label htmlFor="name" style={{ display: "block", marginBottom: 4 }}>
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            style={{
              width: "100%",
              padding: 8,
              fontSize: 14,
              border: "1px solid #ddd",
              borderRadius: 4,
            }}
          />
        </div>

        <div>
          <label htmlFor="email" style={{ display: "block", marginBottom: 4 }}>
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            style={{
              width: "100%",
              padding: 8,
              fontSize: 14,
              border: "1px solid #ddd",
              borderRadius: 4,
            }}
          />
        </div>

        <div>
          <label htmlFor="message" style={{ display: "block", marginBottom: 4 }}>
            Message:
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            style={{
              width: "100%",
              padding: 8,
              fontSize: 14,
              border: "1px solid #ddd",
              borderRadius: 4,
              resize: "vertical",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: "12px 24px",
            fontSize: 16,
            fontWeight: "bold",
            backgroundColor: isSubmitting ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </Form>

      {/* Feedback após submissão */}
      {actionData && (
        <div
          style={{
            marginTop: 24,
            padding: 16,
            borderRadius: 8,
            backgroundColor: actionData.success ? "#d4edda" : "#f8d7da",
            color: actionData.success ? "#155724" : "#721c24",
            border: `1px solid ${actionData.success ? "#c3e6cb" : "#f5c6cb"}`,
          }}
        >
          <strong>
            {actionData.success ? "✓ Success!" : "✗ Error"}
          </strong>
          <p style={{ margin: "8px 0 0 0" }}>
            {actionData.success ? actionData.message : actionData.error}
          </p>
        </div>
      )}
    </div>
  );
}
