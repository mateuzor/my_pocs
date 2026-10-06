import { app, BrowserWindow, shell } from 'electron';
import path from 'node:path';
import { registerIpcHandlers } from './ipc';
import { buildMenu } from './menu';

const devUrl = process.env.VITE_DEV_SERVER_URL;

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 650,
    webPreferences: {
      // Compiled preload sits in dist/preload next to dist/main.
      preload: path.join(__dirname, '../preload/preload.js'),
      // Security baseline (all are defaults in modern Electron; explicit on purpose):
      contextIsolation: true, // preload and page run in separate JS worlds
      nodeIntegration: false, // page cannot require('fs')
      sandbox: true, // OS-level sandbox for the renderer process
    },
  });

  if (devUrl) {
    win.loadURL(devUrl);
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // Never let the app window navigate to or spawn arbitrary sites;
  // open external links in the user's browser instead.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (devUrl ? !url.startsWith(devUrl) : !url.startsWith('file://')) e.preventDefault();
  });
}

app.whenReady().then(() => {
  registerIpcHandlers();
  buildMenu();
  createWindow();

  // macOS: re-create a window when the dock icon is clicked and none are open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// On macOS apps conventionally stay alive without windows.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
