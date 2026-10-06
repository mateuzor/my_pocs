import { app, BrowserWindow, Menu, MenuItemConstructorOptions } from 'electron';
import type { EventChannels } from '../shared/ipc';

// Menu clicks happen in main; we forward them to the renderer as typed events
// so the UI stays the single owner of editor state.
function send<C extends keyof EventChannels>(channel: C, payload: EventChannels[C]) {
  BrowserWindow.getFocusedWindow()?.webContents.send(channel, payload);
}

export function buildMenu() {
  const isMac = process.platform === 'darwin';

  const template: MenuItemConstructorOptions[] = [
    // macOS expects the first menu to be the app menu.
    ...(isMac ? [{ role: 'appMenu' as const }] : []),
    {
      label: 'File',
      submenu: [
        // accelerator registers the keyboard shortcut; CmdOrCtrl maps per platform.
        { label: 'Open...', accelerator: 'CmdOrCtrl+O', click: () => send('menu:action', 'open') },
        { label: 'Save As...', accelerator: 'CmdOrCtrl+S', click: () => send('menu:action', 'save') },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' },
      ],
    },
    { role: 'editMenu' },
    { role: 'viewMenu' },
    {
      label: 'Help',
      submenu: [{ label: `About ${app.name}`, click: () => send('menu:action', 'about') }],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
