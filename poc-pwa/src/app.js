const status = document.getElementById("status");
window.addEventListener("online", () => status.textContent = "Online");
window.addEventListener("offline", () => status.textContent = "Offline");

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js")
    .then(reg => console.log("✅ Service Worker registered", reg))
    .catch(err => console.error("❌ Service worker registration failed:", err));
}

document.getElementById("notify").addEventListener("click", () => {
  if (Notification.permission === "granted") {
    navigator.serviceWorker.getRegistration().then(reg => {
      reg.showNotification("🎉 Hello from your PWA!", {
        body: "This is a simulated push notification.",
        icon: "icons/icon-192.png"
      });
    });
  } else {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        alert("Permission granted. Try again!");
      }
    });
  }
});
