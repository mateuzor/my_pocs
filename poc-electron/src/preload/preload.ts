import { contextBridge, ipcRenderer } from 'electron';
import type { ElectronApi, InvokeChannels, MenuAction } from '../shared/ipc';

// Typed wrapper: channel name determines args and return type.
function invoke<C extends keyof InvokeChannels>(
  channel: C,
  ...args: InvokeChannels[C]['args']
): Promise<InvokeChannels[C]['result']> {
  return ipcRenderer.invoke(channel, ...args);
}

// With contextIsolation the preload runs in its own JS world. exposeInMainWorld
// copies only this object into the page, so the renderer never touches
// ipcRenderer or Node. Expose narrow functions, never the raw ipcRenderer
// (that would let any XSS send arbitrary IPC messages).
const api: ElectronApi = {
  openFile: () => invoke('file:open'),
  saveFile: (req) => invoke('file:save', req),
  notify: (req) => invoke('notify:show', req),
  getAppInfo: () => invoke('app:info'),
  onMenuAction: (cb) => {
    // Wrap the listener so the IpcRendererEvent (which leaks sender) is not exposed.
    const listener = (_e: unknown, action: MenuAction) => cb(action);
    ipcRenderer.on('menu:action', listener);
    return () => ipcRenderer.removeListener('menu:action', listener);
  },
};

contextBridge.exposeInMainWorld('api', api);
