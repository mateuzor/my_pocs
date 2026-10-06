import { useCallback, useEffect, useState } from 'react';
import type { AppInfo } from '../shared/ipc';

export function App() {
  const [content, setContent] = useState('');
  const [filePath, setFilePath] = useState<string | null>(null);
  const [status, setStatus] = useState('Ready');
  const [info, setInfo] = useState<AppInfo | null>(null);

  useEffect(() => {
    window.api.getAppInfo().then(setInfo);
  }, []);

  const open = useCallback(async () => {
    const file = await window.api.openFile();
    if (!file) return;
    setContent(file.content);
    setFilePath(file.path);
    setStatus(`Opened ${file.path}`);
  }, []);

  const save = useCallback(async () => {
    const saved = await window.api.saveFile({
      suggestedName: filePath ?? 'untitled.txt',
      content,
    });
    if (!saved) return;
    setFilePath(saved);
    setStatus(`Saved ${saved}`);
    // Notification is shown by main; the renderer only requests it.
    await window.api.notify({ title: 'File saved', body: saved });
  }, [content, filePath]);

  // Native menu items arrive as events from main. Re-subscribe when handlers
  // change and unsubscribe on cleanup to avoid duplicated listeners.
  useEffect(() => {
    return window.api.onMenuAction((action) => {
      if (action === 'open') void open();
      if (action === 'save') void save();
      if (action === 'about' && info) {
        setStatus(`v${info.version} - Electron ${info.electron} on ${info.platform}`);
      }
    });
  }, [open, save, info]);

  return (
    <main>
      <h1>Electron POC</h1>
      <p>
        <button onClick={open}>Open...</button>
        <button onClick={save}>Save as...</button>
        <button onClick={() => window.api.notify({ title: 'Hello', body: 'Native notification' })}>
          Notify
        </button>
      </p>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <p className="meta">{status}</p>
    </main>
  );
}
