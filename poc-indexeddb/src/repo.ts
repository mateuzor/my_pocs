import { getDb, type Note } from './db';

const DAY = 86_400_000;

export async function seed(count = 20) {
  const db = await getDb();
  const tags = ['inbox', 'work', 'idea', 'archive'];
  // One readwrite transaction for all writes: it is faster and all-or-nothing.
  const tx = db.transaction('notes', 'readwrite');
  for (let i = 0; i < count; i++) {
    tx.store.add({
      title: `note ${i + 1}`,
      tag: tags[i % tags.length],
      createdAt: Date.now() - i * DAY,
    });
  }
  await tx.done; // `done` resolves only when the transaction commits
}

export async function clear() {
  await (await getDb()).clear('notes');
}

// Index + key range. Ranges are expressed with IDBKeyRange, never filtered in JS,
// so the engine only walks matching entries.
export async function query(opts: { tag?: string; from?: number; to?: number }): Promise<Note[]> {
  const db = await getDb();
  const { tag, from = 0, to = Number.MAX_SAFE_INTEGER } = opts;

  if (tag) {
    // Compound index: the range is [tag, from] .. [tag, to].
    return db.getAllFromIndex('notes', 'by-tag-created', IDBKeyRange.bound([tag, from], [tag, to]));
  }
  return db.getAllFromIndex('notes', 'by-created', IDBKeyRange.bound(from, to));
}

// Cursors stream records one by one and allow in-place updates without loading everything in memory.
export async function uppercaseTitles(): Promise<number> {
  const db = await getDb();
  const tx = db.transaction('notes', 'readwrite');
  let cursor = await tx.store.openCursor();
  let n = 0;
  while (cursor) {
    const note = cursor.value;
    if (note.title !== note.title.toUpperCase()) {
      await cursor.update({ ...note, title: note.title.toUpperCase() });
      n++;
    }
    cursor = await cursor.continue();
  }
  await tx.done;
  return n;
}

// Transaction demo: read + delete + write across two operations. If anything throws,
// the transaction aborts and NOTHING is applied.
export async function archiveOldestInbox(): Promise<Note | undefined> {
  const db = await getDb();
  const tx = db.transaction(['notes', 'meta'], 'readwrite');
  try {
    // Oldest inbox note = first entry of the compound index range for tag "inbox".
    const index = tx.objectStore('notes').index('by-tag-created');
    const cursor = await index.openCursor(IDBKeyRange.bound(['inbox', 0], ['inbox', Infinity]));
    if (!cursor) {
      tx.abort();
      return undefined;
    }
    const moved = { ...cursor.value, tag: 'archive' };
    await cursor.update(moved);
    await tx.objectStore('meta').put({ key: 'lastArchivedId', value: moved.id });
    await tx.done;
    return moved;
  } catch (err) {
    tx.abort();
    throw err;
  }
}
