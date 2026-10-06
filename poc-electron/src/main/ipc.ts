import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron';
import type { InvokeChannels } from '../shared/ipc';
import { openFile, saveFile } from './files';
import { showNotification } from './notifications';

type Handler<C extends keyof InvokeChannels> = (
  event: IpcMainInvokeEvent,
  ...args: InvokeChannels[C]['args']
) => InvokeChannels[C]['result'] | Promise<InvokeChannels[C]['result']>;

// Typed handle(): the handler signature is derived from the shared contract.
function handle<C extends keyof InvokeChannels>(channel: C, handler: Handler<C>) {
  ipcMain.handle(channel, (event, ...args) =>
    (handler as (e: IpcMainInvokeEvent, ...a: unknown[]) => unknown)(event, ...args),
  );
}

export function registerIpcHandlers() {
  // Resolve the window that sent the request so dialogs attach to it (modal sheet on macOS).
  const winOf = (e: IpcMainInvokeEvent) => BrowserWindow.fromWebContents(e.sender);

  handle('file:open', (e) => openFile(winOf(e)));
  handle('file:save', (e, req) => saveFile(winOf(e), req));
  handle('notify:show', (_e, req) => showNotification(req));
  handle('app:info', () => ({
    version: app.getVersion(),
    electron: process.versions.electron,
    platform: process.platform,
  }));
}
