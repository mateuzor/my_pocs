import { useNotifications } from "./notifications.js";

const statusEl = document.getElementById("status");
const checkSupportBtn = document.getElementById("checkSupportBtn");
const requestPermissionBtn = document.getElementById("requestPermissionBtn");
const notifyBtn = document.getElementById("notifyBtn");
const scheduleBtn = document.getElementById("scheduleBtn");
const requireInteractionInput = document.getElementById(
  "requireInteractionInput"
);
const delayInput = document.getElementById("delayInput");

// Instancia o hook, passando o elemento de status
const notifications = useNotifications(statusEl);

// Atualiza o estado dos botões
function updateButtons() {
  const supported = notifications.isSupported();
  const canNotify = notifications.canNotify();

  checkSupportBtn.disabled = false;
  requestPermissionBtn.disabled = !supported;
  notifyBtn.disabled = !canNotify;
  scheduleBtn.disabled = !canNotify;
}

// Estado inicial
if (!notifications.isSupported()) {
  notifications.setStatus(
    "Notifications API is NOT supported in this browser. Try desktop Chrome or Edge."
  );
} else {
  notifications.setStatus(
    "Notifications API detected. Current permission: " +
      notifications.getPermission()
  );
}

updateButtons();

// Adiciona os listeners
checkSupportBtn.addEventListener("click", () => {
  if (!notifications.isSupported()) {
    notifications.setStatus(
      "Notifications API is NOT supported. You cannot use notifications here."
    );
  } else {
    notifications.setStatus(
      "Notifications API is supported. Current permission: " +
        notifications.getPermission()
    );
  }
  updateButtons();
});

requestPermissionBtn.addEventListener("click", async () => {
  await notifications.requestPermission();
  updateButtons();
});

notifyBtn.addEventListener("click", () => {
  const requireInteraction =
    !!requireInteractionInput && requireInteractionInput.checked;

  notifications.sendNotification({
    title: "Web Notifications PoC",
    body: "This is a basic test notification.",
    requireInteraction,
  });

  updateButtons();
});

scheduleBtn.addEventListener("click", () => {
  const requireInteraction =
    !!requireInteractionInput && requireInteractionInput.checked;

  const delaySeconds = Number(delayInput?.value || 0);
  const delayMs = Math.max(0, delaySeconds) * 1000;

  notifications.scheduleNotification(delayMs, {
    title: "Scheduled notification",
    body: "This notification was scheduled.",
    requireInteraction,
  });

  updateButtons();
});
