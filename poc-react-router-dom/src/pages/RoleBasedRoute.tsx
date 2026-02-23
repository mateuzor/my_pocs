import { createContext, useContext, useState, ReactNode } from "react";
import { Navigate, Outlet, Link } from "react-router-dom";

// ---------------------------------------------------------------------------
// Role types
// ---------------------------------------------------------------------------

type Role = "guest" | "user" | "admin";

// ---------------------------------------------------------------------------
// Role Auth Context
// ---------------------------------------------------------------------------

interface RoleAuthContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const RoleAuthContext = createContext<RoleAuthContextType>({
  role: "guest",
  setRole: () => {},
});

export function RoleAuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("guest");

  return (
    <RoleAuthContext.Provider value={{ role, setRole }}>
      {children}
    </RoleAuthContext.Provider>
  );
}

export function useRoleAuth() {
  return useContext(RoleAuthContext);
}

// ---------------------------------------------------------------------------
// RoleBasedRoute wrapper
// ---------------------------------------------------------------------------

interface RoleBasedRouteProps {
  allowedRoles: Role[];
  redirectTo?: string;
}

export function RoleBasedRoute({
  allowedRoles,
  redirectTo = "/role-demo",
}: RoleBasedRouteProps) {
  const { role } = useRoleAuth();

  if (!allowedRoles.includes(role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}

// ---------------------------------------------------------------------------
// Role selector / demo landing page
// ---------------------------------------------------------------------------

const roleColors: Record<Role, string> = {
  guest: "#6c757d",
  user: "#0d6efd",
  admin: "#dc3545",
};

const roleBadgeStyle = (role: Role): React.CSSProperties => ({
  display: "inline-block",
  padding: "0.25rem 0.75rem",
  background: roleColors[role],
  color: "#fff",
  borderRadius: 20,
  fontWeight: 600,
  fontSize: "0.85rem",
});

export function RoleDemoPage() {
  const { role, setRole } = useRoleAuth();

  return (
    <div style={{ padding: "2rem", maxWidth: 600, margin: "0 auto" }}>
      <h1>Role-Based Route Access Control</h1>

      <p style={{ color: "#666" }}>
        Select a role below to simulate different access levels. Each route
        checks the current role and redirects unauthorized users.
      </p>

      <div
        style={{
          background: "#f8f9fa",
          border: "1px solid #dee2e6",
          borderRadius: 8,
          padding: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <p style={{ margin: "0 0 0.75rem" }}>
          Current role: <span style={roleBadgeStyle(role)}>{role}</span>
        </p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {(["guest", "user", "admin"] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              style={{
                padding: "0.5rem 1rem",
                background: role === r ? roleColors[r] : "#e9ecef",
                color: role === r ? "#fff" : "#333",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <h2 style={{ fontSize: "1.1rem" }}>Available pages by role:</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
        <thead>
          <tr style={{ background: "#f8f9fa" }}>
            <th style={{ padding: "0.5rem", textAlign: "left", border: "1px solid #dee2e6" }}>Page</th>
            <th style={{ padding: "0.5rem", textAlign: "center", border: "1px solid #dee2e6" }}>Guest</th>
            <th style={{ padding: "0.5rem", textAlign: "center", border: "1px solid #dee2e6" }}>User</th>
            <th style={{ padding: "0.5rem", textAlign: "center", border: "1px solid #dee2e6" }}>Admin</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: "0.5rem", border: "1px solid #dee2e6" }}>Public Area</td>
            <td style={{ padding: "0.5rem", textAlign: "center", border: "1px solid #dee2e6" }}>✅</td>
            <td style={{ padding: "0.5rem", textAlign: "center", border: "1px solid #dee2e6" }}>✅</td>
            <td style={{ padding: "0.5rem", textAlign: "center", border: "1px solid #dee2e6" }}>✅</td>
          </tr>
          <tr>
            <td style={{ padding: "0.5rem", border: "1px solid #dee2e6" }}>User Area</td>
            <td style={{ padding: "0.5rem", textAlign: "center", border: "1px solid #dee2e6" }}>❌</td>
            <td style={{ padding: "0.5rem", textAlign: "center", border: "1px solid #dee2e6" }}>✅</td>
            <td style={{ padding: "0.5rem", textAlign: "center", border: "1px solid #dee2e6" }}>✅</td>
          </tr>
          <tr>
            <td style={{ padding: "0.5rem", border: "1px solid #dee2e6" }}>Admin Panel</td>
            <td style={{ padding: "0.5rem", textAlign: "center", border: "1px solid #dee2e6" }}>❌</td>
            <td style={{ padding: "0.5rem", textAlign: "center", border: "1px solid #dee2e6" }}>❌</td>
            <td style={{ padding: "0.5rem", textAlign: "center", border: "1px solid #dee2e6" }}>✅</td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link
          to="/role-public"
          style={{
            padding: "0.5rem 1rem",
            background: roleColors.guest,
            color: "#fff",
            borderRadius: 6,
            textDecoration: "none",
          }}
        >
          Go to Public Area
        </Link>
        <Link
          to="/role-user"
          style={{
            padding: "0.5rem 1rem",
            background: roleColors.user,
            color: "#fff",
            borderRadius: 6,
            textDecoration: "none",
          }}
        >
          Go to User Area
        </Link>
        <Link
          to="/role-admin"
          style={{
            padding: "0.5rem 1rem",
            background: roleColors.admin,
            color: "#fff",
            borderRadius: 6,
            textDecoration: "none",
          }}
        >
          Go to Admin Panel
        </Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Role-specific pages
// ---------------------------------------------------------------------------

export function PublicAreaPage() {
  const { role } = useRoleAuth();
  return (
    <div style={{ padding: "2rem", maxWidth: 500, margin: "0 auto" }}>
      <h1>Public Area</h1>
      <p>
        Role: <span style={roleBadgeStyle(role)}>{role}</span>
      </p>
      <p>This page is accessible to everyone, including guests.</p>
      <Link to="/role-demo">Back to Role Demo</Link>
    </div>
  );
}

export function UserAreaPage() {
  const { role } = useRoleAuth();
  return (
    <div style={{ padding: "2rem", maxWidth: 500, margin: "0 auto" }}>
      <h1>User Area</h1>
      <p>
        Role: <span style={roleBadgeStyle(role)}>{role}</span>
      </p>
      <p>This page requires at least the <strong>user</strong> role.</p>
      <Link to="/role-demo">Back to Role Demo</Link>
    </div>
  );
}

export function AdminPanelPage() {
  const { role } = useRoleAuth();
  return (
    <div style={{ padding: "2rem", maxWidth: 500, margin: "0 auto" }}>
      <h1>Admin Panel</h1>
      <p>
        Role: <span style={roleBadgeStyle(role)}>{role}</span>
      </p>
      <p>This page requires the <strong>admin</strong> role.</p>
      <Link to="/role-demo">Back to Role Demo</Link>
    </div>
  );
}
