import PermissionPanel from "./components/PermissionPanel";

export default function App() {
  return (
    <div className="container">
      <header>
        <div>
          <h1>poc-web-notifications-api</h1>
          <div className="sub">Web Notifications API</div>
        </div>
      </header>

      <div className="row">
        <div className="col">
          <PermissionPanel />
        </div>
      </div>
    </div>
  );
}
