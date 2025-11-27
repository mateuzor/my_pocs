const statusEl = document.getElementById("status");
const checkSupportBtn = document.getElementById("checkSupportBtn");
const requestPermissionBtn = document.getElementById("requestPermissionBtn");
const notifyBtn = document.getElementById("notifyBtn");
const titleInput = document.getElementById("titleInput");
const bodyInput = document.getElementById("bodyInput");

// Verifica se a Notification API é suportada pelo navegador
function isSupported() {
  return typeof Notification !== "undefined";
}

// Atualiza a mensagem de status na tela e loga no console
function setStatus(message) {
  statusEl.textContent = message;
  console.log("[notifications]", message);
}

// Atualiza o estado (enable/disable) dos botões de ação
function updateButtons() {
  const supported = isSupported();

  // Sempre dá pra checar suporte
  checkSupportBtn.disabled = false;

  // Só dá pra pedir permissão se houver suporte
  requestPermissionBtn.disabled = !supported;

  // Só habilita "Show notification" se:
  // - tiver suporte
  // - permissão já for "granted"
  const canNotify = supported && Notification.permission === "granted";
  notifyBtn.disabled = !canNotify;
}

// Pede permissão para mostrar notificações
async function requestPermission() {
  if (!isSupported()) {
    setStatus("Cannot request permission: API not supported.");
    return Notification.permission;
  }

  setStatus("Requesting permission...");

  try {
    const result = await Notification.requestPermission();
    // result: "granted" | "denied" | "default"
    setStatus("Permission result: " + result);
    updateButtons();
    return result;
  } catch (error) {
    console.error("Permission error", error);
    setStatus("Error while requesting permission.");
    return Notification.permission;
  }
}

// Envia uma notificação básica (ou com título/corpo customizados, se existirem inputs)
function sendNotification() {
  if (!isSupported()) {
    setStatus("Cannot show notification: API not supported.");
    return;
  }

  if (Notification.permission !== "granted") {
    setStatus(
      "Cannot show notification: permission is " + Notification.permission
    );
    updateButtons();
    return;
  }

  // Se existirem inputs de título/corpo, usamos; senão caímos em valores padrão.
  const rawTitle = titleInput ? titleInput.value : "Web Notifications PoC";
  const rawBody = bodyInput
    ? bodyInput.value
    : "This is a basic test notification.";

  const title =
    rawTitle && rawTitle.trim().length > 0
      ? rawTitle.trim()
      : "Web Notifications PoC";
  const body =
    rawBody && rawBody.trim().length > 0 ? rawBody.trim() : undefined;

  try {
    const n = new Notification(title, { body });

    setStatus(
      "Notification sent. Check your OS notification area / popup area."
    );

    n.onclick = () => {
      window.focus();
    };
  } catch (error) {
    console.error("Notification error", error);
    setStatus("Error while trying to create notification.");
  }
}

// inicialização ao carregar o módulo

// Mostra o status inicial baseado no suporte + permissão atual
if (!isSupported()) {
  setStatus(
    "Notifications API is NOT supported in this browser. Try desktop Chrome or Edge."
  );
} else {
  setStatus(
    "Notifications API detected. Current permission: " + Notification.permission
  );
}

// Ajusta os botões de acordo com o estado atual
updateButtons();

checkSupportBtn.addEventListener("click", () => {
  if (!isSupported()) {
    setStatus(
      "Notifications API is NOT supported. You cannot use notifications here."
    );
  } else {
    setStatus(
      "Notifications API is supported. Current permission: " +
        Notification.permission
    );
  }
  updateButtons();
});

requestPermissionBtn.addEventListener("click", () => {
  requestPermission();
});

notifyBtn.addEventListener("click", () => {
  sendNotification();
});
