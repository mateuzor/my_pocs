// Service Worker Registration
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then((reg) => {
      console.log("[App] Service Worker registered, scope:", reg.scope);
      updateStatus();
    })
    .catch((err) => console.error("[App] SW registration failed:", err));
}

// Update the status indicator based on SW state and network connection
function updateStatus() {
  const el = document.getElementById("sw-status");
  if (!el) return;

  const swActive = navigator.serviceWorker.controller !== null;
  const online = navigator.onLine;

  // Show SW status + connection state
  el.textContent = `SW: ${swActive ? "active" : "registering"} | Network: ${online ? "online" : "offline"}`;
  el.style.background = online ? "#e6ffed" : "#fff5f5";
  el.style.color = online ? "#276749" : "#c53030";
  el.style.border = `1px solid ${online ? "#9ae6b4" : "#feb2b2"}`;
}

// Listen for online/offline events to update the UI in real time
window.addEventListener("online", updateStatus);
window.addEventListener("offline", updateStatus);
