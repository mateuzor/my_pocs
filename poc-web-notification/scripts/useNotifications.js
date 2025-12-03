export function useNotifications(statusEl) {
  // Atualiza status na tela + loga no console
  function setStatus(message) {
    if (statusEl) {
      statusEl.textContent = message;
    }
    console.log("[notifications]", message);
  }

  // Verifica se a Notification API é suportada
  function isSupported() {
    return typeof Notification !== "undefined";
  }

  // Lê a permissão atual ("default" | "granted" | "denied") ou "unsupported"
  function getPermission() {
    if (!isSupported()) return "unsupported";
    return Notification.permission;
  }

  // Se podemos de fato notificar agora
  function canNotify() {
    return isSupported() && Notification.permission === "granted";
  }

  // Pede permissão ao navegador
  async function requestPermission() {
    if (!isSupported()) {
      setStatus("Cannot request permission: API not supported.");
      return getPermission();
    }

    setStatus("Requesting permission...");

    try {
      const result = await Notification.requestPermission();
      setStatus("Permission result: " + result);
      return result;
    } catch (error) {
      console.error("Permission error", error);
      setStatus("Error while requesting permission.");
      return getPermission();
    }
  }

  // Envia uma notificação (com suporte a requireInteraction)
  function sendNotification(options = {}) {
    if (!isSupported()) {
      setStatus("Cannot show notification: API not supported.");
      return;
    }

    if (Notification.permission !== "granted") {
      setStatus(
        "Cannot show notification: permission is " + Notification.permission
      );
      return;
    }

    const {
      title = "Web Notifications PoC",
      body = "This is a basic test notification.",
      requireInteraction = false,
    } = options;

    const safeTitle = title?.trim() || "Web Notifications PoC";
    const safeBody = body?.trim() || undefined;

    try {
      const n = new Notification(safeTitle, {
        body: safeBody,
        requireInteraction, // suporte ao requireInteraction
      });

      setStatus(
        "Notification sent. Check your OS notification area / popup area."
      );

      n.onclick = () => window.focus();
    } catch (error) {
      console.error("Notification error", error);
      setStatus("Error while trying to create notification.");
    }
  }

  return {
    setStatus,
    isSupported,
    getPermission,
    canNotify,
    requestPermission,
    sendNotification,
  };
}
