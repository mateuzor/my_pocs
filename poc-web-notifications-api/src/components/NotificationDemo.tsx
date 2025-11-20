
import React, { useState } from "react";
import { useNotifications } from "../hooks/useNotifications";

export default function NotificationDemo() {
  const {
    supported,
    permission,
    visibilityState,
    log,
    requestPermission,
    showNotification,
    scheduleNotification,
    clearLog,
  } = useNotifications();

  const [title, setTitle] = useState("Hello from Notifications API");
  const [body, setBody] = useState("This is a test notification from the PoC.");
  const [delay, setDelay] = useState(5);

  const canNotify = supported && permission === "granted";

  return (
    <div className="card">
      <h2>Notification Playground</h2>
      <p className="small">
        Craft a notification, decide whether to send it now or later, and see how the browser
        behaves when the tab is visible vs. hidden.
      </p>

      {!supported && (
        <p className="small">
          Notifications are not supported here. This demo works best in Chromium-based browsers.
        </p>
      )}

      <div className="row" style={{ marginTop: 10 }}>
        <div className="col">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Notification title"
          />
        </div>
      </div>

      <div className="row" style={{ marginTop: 10 }}>
        <div className="col">
          <label>Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Optional body text"
          />
        </div>
      </div>

      <div className="row" style={{ marginTop: 10, alignItems: "flex-end" }}>
        <div className="col">
          <label>Schedule (seconds)</label>
          <input
            type="number"
            min={0}
            max={300}
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value) || 0)}
          />
        </div>
        <div className="col">
          <div className="actions">
            <button onClick={requestPermission} disabled={!supported || permission === "granted"}>
              {permission === "default" && "Request permission"}
              {permission === "denied" && "Try to request again"}
              {permission === "granted" && "Permission granted"}
            </button>
            <button
              onClick={() => showNotification(title || "Untitled notification", { body })}
              disabled={!canNotify}
            >
              Notify now
            </button>
            <button
              onClick={() =>
                scheduleNotification(delay * 1000, title || "Scheduled notification", { body })
              }
              disabled={!canNotify || delay <= 0}
            >
              Schedule
            </button>
          </div>
          <p className="small" style={{ marginTop: 8 }}>
            Current permission: <b>{permission}</b> • Tab visibility:{" "}
            <b>{visibilityState}</b>
          </p>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="sub">Notification log</span>
          <button onClick={clearLog} disabled={log.length === 0}>
            Clear log
          </button>
        </div>
        <div className="log">
          {log.length === 0 && <span className="small">No notifications yet.</span>}
          {log.map((entry) => (
            <div key={entry.id} style={{ marginBottom: 6 }}>
              <div>
                [{entry.at}] <b>{entry.title}</b>
              </div>
              {entry.body && <div>Body: {entry.body}</div>}
              <div className="small">
                status: <b>{entry.status}</b> • visibility: {entry.visibilityState}
                {entry.errorMessage && <> • error: {entry.errorMessage}</>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
