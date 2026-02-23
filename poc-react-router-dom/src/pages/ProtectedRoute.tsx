import { createContext, useContext, useState, ReactNode } from "react";
import { Navigate, Outlet, useLocation, Link } from "react-router-dom";

// ---------------------------------------------------------------------------
// Auth Context
// ---------------------------------------------------------------------------

interface AuthContextType {
  isAuthenticated: boolean;
  user: string | null;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);

  const login = (username: string) => setUser(username);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!user, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// ---------------------------------------------------------------------------
// ProtectedRoute wrapper
// ---------------------------------------------------------------------------

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login and remember where the user wanted to go
    return <Navigate to="/login-demo" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

// ---------------------------------------------------------------------------
// Login page (demo)
// ---------------------------------------------------------------------------

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/protected-dashboard";

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 480, margin: "0 auto" }}>
      <h1>Login Demo</h1>
      <p style={{ color: "#666" }}>
        This page demonstrates <strong>protected routes</strong>. Click the
        button below to simulate a login and gain access to the protected
        dashboard.
      </p>

      <div
        style={{
          background: "#fff3cd",
          border: "1px solid #ffc107",
          borderRadius: 8,
          padding: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <strong>How it works:</strong>
        <ul style={{ margin: "0.5rem 0 0", paddingLeft: "1.5rem" }}>
          <li>
            <code>AuthContext</code> holds authentication state
          </li>
          <li>
            <code>ProtectedRoute</code> wraps sensitive routes with{" "}
            <code>&lt;Outlet /&gt;</code>
          </li>
          <li>
            Unauthenticated users are redirected here with the original path
            stored in <code>location.state</code>
          </li>
          <li>After login, they are sent back to the intended page</li>
        </ul>
      </div>

      <button
        onClick={() => login("demo_user")}
        style={{
          padding: "0.75rem 1.5rem",
          background: "#0d6efd",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontSize: "1rem",
        }}
      >
        Login as demo_user
      </button>

      <p style={{ marginTop: "1rem" }}>
        <Link to="/">Back to Home</Link>
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Protected Dashboard page
// ---------------------------------------------------------------------------

export function ProtectedDashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "2rem", maxWidth: 600, margin: "0 auto" }}>
      <h1>Protected Dashboard</h1>
      <p style={{ color: "#198754", fontWeight: 600 }}>
        You are authenticated as <strong>{user}</strong>
      </p>

      <div
        style={{
          background: "#d1e7dd",
          border: "1px solid #198754",
          borderRadius: 8,
          padding: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        This page is only accessible to authenticated users. If you try to
        access it directly while logged out, you will be redirected to the login
        page with the original URL preserved in state.
      </div>

      <button
        onClick={logout}
        style={{
          padding: "0.75rem 1.5rem",
          background: "#dc3545",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontSize: "1rem",
          marginRight: "1rem",
        }}
      >
        Logout
      </button>

      <Link to="/">Back to Home</Link>
    </div>
  );
}
