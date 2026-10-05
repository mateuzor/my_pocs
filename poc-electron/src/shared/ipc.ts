// Single source of truth for the IPC contract. Main, preload and renderer all
// import these types, so a channel rename or payload change breaks compilation
// everywhere instead of failing silently at runtime.

export interface OpenedFile {
  path: string;
  content: string;
}

export interface SaveRequest {
  // Suggested name only; the user picks the real path in a native dialog.
  suggestedName: string;
  content: string;
}

export interface NotifyRequest {
  title: string;
  body: string;
}

export interface AppInfo {
  version: string;
  electron: string;
  platform: string;
}

// request/response channels (renderer -> main, via ipcRenderer.invoke)
export interface InvokeChannels {
  'file:open': { args: []; result: OpenedFile | null };
  'file:save': { args: [SaveRequest]; result: string | null };
  'notify:show': { args: [NotifyRequest]; result: boolean };
  'app:info': { args: []; result: AppInfo };
}

// push channels (main -> renderer, via webContents.send)
export type MenuAction = 'open' | 'save' | 'about';
export interface EventChannels {
  'menu:action': MenuAction;
}

// The exact surface exposed on window.api. Nothing else crosses the bridge.
export interface ElectronApi {
  openFile(): Promise<OpenedFile | null>;
  saveFile(req: SaveRequest): Promise<string | null>;
  notify(req: NotifyRequest): Promise<boolean>;
  getAppInfo(): Promise<AppInfo>;
  // Returns an unsubscribe function so React effects can clean up.
  onMenuAction(cb: (action: MenuAction) => void): () => void;
}
