import { useRouteError, isRouteErrorResponse, Link, useNavigate } from "react-router-dom";
import { Component, ReactNode, ErrorInfo } from "react";

// ---------------------------------------------------------------------------
// React Router v6 errorElement component
// Used as the `errorElement` prop on a <Route> — receives error via useRouteError
// ---------------------------------------------------------------------------

export function RouterErrorElement() {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = "Unexpected Error";
  let message = "An unexpected error occurred while loading this page.";
  let statusCode: number | null = null;

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    if (error.status === 404) {
      title = "404 — Not Found";
      message = error.statusText || "The requested page could not be found.";
    } else if (error.status === 401) {
      title = "401 — Unauthorized";
      message = "You do not have permission to view this page.";
    } else if (error.status === 503) {
      title = "503 — Service Unavailable";
      message = "The service is temporarily unavailable. Please try again later.";
    } else {
      title = `${error.status} — ${error.statusText}`;
      message = String(error.data) || "Something went wrong.";
    }
  } else if (error instanceof Error) {
    title = error.name || "Error";
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  }

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
      {statusCode && (
        <div
          style={{
            fontSize: "5rem",
            fontWeight: 900,
            color: "#f8d7da",
            lineHeight: 1,
            marginBottom: "0.5rem",
          }}
        >
          {statusCode}
        </div>
      )}

      <h1 style={{ fontSize: "1.75rem", margin: "0 0 0.75rem", color: "#dc3545" }}>
        {title}
      </h1>

      <p
        style={{
          color: "#6c757d",
          maxWidth: 460,
          marginBottom: "2rem",
          lineHeight: 1.6,
        }}
      >
        {message}
      </p>

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
          onClick={() => navigate(-1)}
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

// ---------------------------------------------------------------------------
// Classic React Error Boundary (class component)
// Catches render errors in the component tree below it
// ---------------------------------------------------------------------------

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class RouteErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[RouteErrorBoundary]", error, info.componentStack);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div
          style={{
            padding: "2rem",
            maxWidth: 560,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <div
            style={{
              background: "#f8d7da",
              border: "1px solid #f5c2c7",
              borderRadius: 8,
              padding: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <h2 style={{ color: "#842029", marginBottom: "0.5rem" }}>
              Something went wrong
            </h2>
            <p style={{ color: "#842029", marginBottom: "0.5rem" }}>
              {this.state.error?.message || "An unexpected render error occurred."}
            </p>
            <code style={{ fontSize: "0.8rem", color: "#842029", wordBreak: "break-all" }}>
              {this.state.error?.stack?.split("\n")[0]}
            </code>
          </div>
          <button
            onClick={this.reset}
            style={{
              padding: "0.6rem 1.4rem",
              background: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: "1rem",
              marginRight: "0.75rem",
            }}
          >
            Try Again
          </button>
          <a
            href="/"
            style={{
              padding: "0.6rem 1.4rem",
              background: "#e9ecef",
              color: "#333",
              borderRadius: 6,
              textDecoration: "none",
              fontSize: "1rem",
            }}
          >
            Go Home
          </a>
        </div>
      );
    }

    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// Demo page that explains both error handling approaches
// ---------------------------------------------------------------------------

function BrokenComponent() {
  throw new Error("This component intentionally threw an error for demo purposes.");
}

export function RouteErrorBoundaryDemo() {
  const [showBroken, setShowBroken] = React.useState(false);

  return (
    <div style={{ padding: "2rem", maxWidth: 680, margin: "0 auto" }}>
      <h1>Route Error Boundaries</h1>

      <div
        style={{
          background: "#f8f9fa",
          border: "1px solid #dee2e6",
          borderRadius: 8,
          padding: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <strong>Two approaches to route-level error handling:</strong>
        <ol style={{ margin: "0.5rem 0 0", paddingLeft: "1.5rem" }}>
          <li>
            <strong>React Router's <code>errorElement</code></strong> — catches errors thrown
            in loaders, actions, or during rendering via <code>useRouteError()</code>
          </li>
          <li>
            <strong>React Error Boundary</strong> — a class component that catches
            render errors in any component tree below it using{" "}
            <code>getDerivedStateFromError</code>
          </li>
        </ol>
      </div>

      <h2 style={{ fontSize: "1.1rem" }}>React Error Boundary Demo</h2>
      <p style={{ color: "#666", marginBottom: "1rem" }}>
        Click the button below to render a broken component. The{" "}
        <code>RouteErrorBoundary</code> wrapper will catch the error and show a
        recovery UI instead of crashing the entire page.
      </p>

      <RouteErrorBoundary>
        {showBroken ? (
          <BrokenComponent />
        ) : (
          <div
            style={{
              background: "#d1e7dd",
              border: "1px solid #198754",
              borderRadius: 8,
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            The component below is working fine. Click the button to simulate an error.
          </div>
        )}
      </RouteErrorBoundary>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1rem" }}>
        <button
          onClick={() => setShowBroken(true)}
          style={{
            padding: "0.6rem 1.2rem",
            background: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Throw an Error
        </button>
        <button
          onClick={() => setShowBroken(false)}
          style={{
            padding: "0.6rem 1.2rem",
            background: "#6c757d",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Reset
        </button>
        <Link to="/" style={{ padding: "0.6rem 1.2rem", color: "#0d6efd", textDecoration: "none" }}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}

// Need React for useState in the demo above
import React from "react";
