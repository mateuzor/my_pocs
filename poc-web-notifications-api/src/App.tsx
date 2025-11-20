import PermissionPanel from "./components/PermissionPanel";
import NotificationDemo from "./components/NotificationDemo";

export default function App() {
  return (
    <div className="container">
      <header>
        <div>
          <h1>poc-web-notifications-api</h1>
          <div className="sub">
            Web Notifications API • Permission handling • Page visibility • Scheduling
          </div>
        </div>
        <span className="badge">React + Vite + TypeScript</span>
      </header>

      <div className="row">
        <div className="col">
          <PermissionPanel />
        </div>
        <div className="col">
          <NotificationDemo />
        </div>
      </div>
    </div>
  );
}
