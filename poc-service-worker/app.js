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

// Handle form submission — queue if offline, send immediately if online
async function handleFormSubmit(event) {
  event.preventDefault();
  const message = document.getElementById("message-input")?.value;
  if (!message) return;

  if (!navigator.onLine) {
    // Store the request in a dedicated cache to be synced later
    const cache = await caches.open("pending-requests");
    const fakeRequest = new Request("/api/messages", {
      method: "POST",
      body: JSON.stringify({ message, timestamp: Date.now() }),
      headers: { "Content-Type": "application/json" },
    });
    await cache.put(fakeRequest, new Response("pending"));

    // Register a background sync — browser will call SW sync event when online
    const reg = await navigator.serviceWorker.ready;
    if ("sync" in reg) {
      await reg.sync.register("sync-pending-requests");
      console.log("[App] Background sync registered");
    }

    alert("You are offline. Your message will be sent when you reconnect.");
  } else {
    // Online: send immediately
    console.log("[App] Sending message:", message);
    alert("Message sent: " + message);
  }
}

// Attach submit handler after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("sync-form");
  if (form) form.addEventListener("submit", handleFormSubmit);
});
