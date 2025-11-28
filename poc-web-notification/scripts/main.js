import {
  isSupported,
  setStatus,
  requestPermission,
  sendNotification,
} from "./notifications.js";

const statusEl = document.getElementById("status");
const checkSupportBtn = document.getElementById("checkSupportBtn");
const requestPermissionBtn = document.getElementById("requestPermissionBtn");
const notifyBtn = document.getElementById("notifyBtn");
const titleInput = document.getElementById("titleInput");
const bodyInput = document.getElementById("bodyInput");

// Atualiza o estado dos botões
function updateButtons() {
  const supported = isSupported();

  checkSupportBtn.disabled = false;
  requestPermissionBtn.disabled = !supported;

  const canNotify = supported && Notification.permission === "granted";
  notifyBtn.disabled = !canNotify;
}

// Estado inicial
if (!isSupported()) {
  setStatus(
    statusEl,
    "Notifications API is NOT supported in this browser. Try desktop Chrome or Edge."
  );
} else {
  setStatus(
    statusEl,
    "Notifications API detected. Current permission: " + Notification.permission
  );
}

updateButtons();

// Adiciona os listeners

checkSupportBtn.addEventListener("click", () => {
  if (!isSupported()) {
    setStatus(
      statusEl,
      "Notifications API is NOT supported. You cannot use notifications here."
    );
  } else {
    setStatus(
      statusEl,
      "Notifications API is supported. Current permission: " +
        Notification.permission
    );
  }
  updateButtons();
});

requestPermissionBtn.addEventListener("click", async () => {
  await requestPermission(statusEl);
  updateButtons();
});

notifyBtn.addEventListener("click", () => {
  const title = titleInput?.value || "Web Notifications PoC";
  const body = bodyInput?.value || "This is a basic test notification.";
  sendNotification(statusEl, title, body);
  updateButtons();
});
