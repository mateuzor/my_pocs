import { Notification } from 'electron';
import type { NotifyRequest } from '../shared/ipc';

// Native OS notification created from the main process (the Notification
// module is the main-side API; the renderer asks for it over IPC).
export function showNotification({ title, body }: NotifyRequest): boolean {
  if (!Notification.isSupported()) return false;
  new Notification({ title, body }).show();
  return true;
}
