// Verifica suporte à Notification API
export function isSupported() {
  return typeof Notification !== "undefined";
}

// Atualiza e loga o status
export function setStatus(statusEl, message) {
  statusEl.textContent = message;
  console.log("[notifications]", message);
}

// Pede permissão ao navegador
export async function requestPermission(statusEl) {
  if (!isSupported()) {
    setStatus(statusEl, "Cannot request permission: API not supported.");
    console.log("[notifications]", message);
    return Notification.permission;
  }

  setStatus(statusEl, "Requesting permission...");

  try {
    const result = await Notification.requestPermission();
    setStatus(statusEl, "Permission result: " + result);
    return result;
  } catch (err) {
    console.error(err);
    setStatus(statusEl, "Error requesting permission.");
    return Notification.permission;
  }
}

// Envia a notificação
export function sendNotification(statusEl, title, body) {
  if (!isSupported()) {
    setStatus(statusEl, "Cannot show notification: API not supported.");
    return;
  }

  if (Notification.permission !== "granted") {
    setStatus(
      statusEl,
      "Cannot show notification: permission is " + Notification.permission
    );
    return;
  }

  const safeTitle = title?.trim() || "Web Notifications PoC";
  const safeBody = body?.trim() || undefined;

  try {
    const n = new Notification(safeTitle, { body: safeBody });

    setStatus(
      statusEl,
      "Notification sent. Check your OS notification area / popup area."
    );

    n.onclick = () => window.focus();
  } catch (error) {
    console.error(error);
    setStatus(statusEl, "Error while trying to create notification.");
  }
}
