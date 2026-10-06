import { dialog, BrowserWindow } from 'electron';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { OpenedFile, SaveRequest } from '../shared/ipc';

const MAX_BYTES = 2 * 1024 * 1024;

// File access lives ONLY in the main process. The renderer never gets a path
// to read: the user chooses it in a native dialog, which is the trust boundary.
export async function openFile(win: BrowserWindow | null): Promise<OpenedFile | null> {
  const opts = {
    properties: ['openFile' as const],
    filters: [{ name: 'Text', extensions: ['txt', 'md', 'json'] }],
  };
  const result = win ? await dialog.showOpenDialog(win, opts) : await dialog.showOpenDialog(opts);
  if (result.canceled || result.filePaths.length === 0) return null;

  const filePath = result.filePaths[0];
  const stat = await fs.stat(filePath);
  // Guard memory: IPC serializes the whole string into the renderer.
  if (stat.size > MAX_BYTES) throw new Error('File too large (max 2 MB)');
  return { path: filePath, content: await fs.readFile(filePath, 'utf-8') };
}

export async function saveFile(win: BrowserWindow | null, req: SaveRequest): Promise<string | null> {
  const opts = { defaultPath: path.basename(req.suggestedName) };
  const result = win ? await dialog.showSaveDialog(win, opts) : await dialog.showSaveDialog(opts);
  if (result.canceled || !result.filePath) return null;
  await fs.writeFile(result.filePath, req.content, 'utf-8');
  return result.filePath;
}
