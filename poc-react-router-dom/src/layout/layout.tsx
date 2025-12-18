import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div style={{ padding: 16 }}>
      <nav style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/users">Users</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/admin">Admin</NavLink>
      </nav>

      <hr style={{ marginBottom: 16 }} />

      {/* As páginas (Home/About) aparecem aqui */}
      <Outlet />
    </div>
  );
}
