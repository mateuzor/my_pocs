import { useCallback, useEffect, useMemo, useState } from "react";

export type NotificationPermissionState =
  | NotificationPermission
  | "unsupported";

export interface NotificationOptionsLite {
  body?: string;
  tag?: string;
  requireInteraction?: boolean;
}

export interface NotificationLogEntry {
  id: string;
  at: string;
  title: string;
  body?: string;
  visibilityState: DocumentVisibilityState;
  status: "shown" | "blocked" | "error" | "unsupported";
  errorMessage?: string;
}

function nowIso() {
  return new Date().toISOString();
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermissionState>(
    () => {
      if (
        typeof window === "undefined" ||
        typeof Notification === "undefined"
      ) {
        return "unsupported";
      }
      return Notification.permission;
    }
  );

  const [visibilityState, setVisibilityState] =
    useState<DocumentVisibilityState>(
      typeof document === "undefined" ? "visible" : document.visibilityState
    );

  const [log, setLog] = useState<NotificationLogEntry[]>([]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const handler = () => setVisibilityState(document.visibilityState);
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  const supported = useMemo(
    () => typeof window !== "undefined" && typeof Notification !== "undefined",
    []
  );

  const requestPermission = useCallback(async () => {
    if (!supported) {
      setPermission("unsupported");
      return "unsupported" as const;
    }
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (e) {
      console.warn("Notification permission error", e);
      return permission;
    }
  }, [supported, permission]);

  const showNotification = useCallback(
    (title: string, options?: NotificationOptionsLite) => {
      const base: NotificationLogEntry = {
        id: Math.random().toString(36).slice(2),
        at: nowIso(),
        title,
        body: options?.body,
        visibilityState,
        status: "shown",
      };

      if (!supported) {
        setLog((prev) => [
          {
            ...base,
            status: "unsupported",
            errorMessage: "Notifications API not supported",
          },
          ...prev,
        ]);
        return;
      }

      if (permission !== "granted") {
        setLog((prev) => [
          {
            ...base,
            status: "blocked",
            errorMessage: `Permission is ${permission}`,
          },
          ...prev,
        ]);
        return;
      }

      try {
        const n = new Notification(title, {
          body: options?.body,
          tag: options?.tag,
          requireInteraction: options?.requireInteraction,
        });
        n.onclick = () => window.focus();
        setLog((prev) => [base, ...prev]);
      } catch (e: any) {
        setLog((prev) => [
          {
            ...base,
            status: "error",
            errorMessage: e?.message ?? String(e),
          },
          ...prev,
        ]);
      }
    },
    [permission, supported, visibilityState]
  );

  const scheduleNotification = useCallback(
    (delayMs: number, title: string, options?: NotificationOptionsLite) => {
      const scheduledAt = nowIso();
      const id = Math.random().toString(36).slice(2);
      setLog((prev) => [
        {
          id,
          at: scheduledAt,
          title: `[scheduled in ${Math.round(delayMs / 1000)}s] ${title}`,
          body: options?.body,
          visibilityState,
          status: "shown",
        },
        ...prev,
      ]);
      setTimeout(() => {
        showNotification(title, options);
      }, delayMs);
    },
    [showNotification, visibilityState]
  );

  const clearLog = useCallback(() => setLog([]), []);

  return {
    supported,
    permission,
    visibilityState,
    log,
    requestPermission,
    showNotification,
    scheduleNotification,
    clearLog,
  };
}
