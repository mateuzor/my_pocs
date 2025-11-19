import React from "react";
import { useNotifications } from "../hooks/useNotifications";

export default function PermissionPanel() {
  const { supported, permission, visibilityState, requestPermission } =
    useNotifications();

  if (!supported) {
    return (
      <div className="card">
        <h2>Environment & Permission</h2>
        <p className="small">
          Notifications API is not supported in this browser. Try a modern
          Chromium browser (Chrome, Edge) on desktop.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Environment & Permission</h2>
      <p className="small">
        Quick overview of your current support, permission status and page
        visibility. Use this section to understand why notifications might be
        blocked.
      </p>

      <div className="actions" style={{ marginTop: 12 }}>
        <span className="chip">
          <span className={`chip-dot ok`} /> API support: <b>Yes</b>
        </span>
        <span className="chip">
          <span
            className={`chip-dot ${permission === "granted" ? "ok" : "danger"}`}
          />
          Permission: <b>{permission}</b>
        </span>
        <span className="chip">
          <span className="chip-dot ok" />
          Visibility: <b>{visibilityState}</b>
        </span>
      </div>

      <div className="actions">
        <button onClick={requestPermission} disabled={permission === "granted"}>
          {permission === "default" && "Request permission"}
          {permission === "denied" && "Try to request again"}
          {permission === "granted" && "Permission already granted"}
        </button>
      </div>
    </div>
  );
}
