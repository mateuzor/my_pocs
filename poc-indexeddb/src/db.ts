import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

export interface Note {
  id?: number;
  title: string;
  tag: string;
  createdAt: number; // epoch ms, indexed for range queries
}

export interface Meta {
  key: string;
  value: unknown;
}

// DBSchema gives idb typed stores and typed index names: typos fail at compile time
// instead of at runtime with a cryptic NotFoundError.
interface NotesDB extends DBSchema {
  notes: {
    key: number;
    value: Note;
    indexes: { 'by-tag': string; 'by-created': number; 'by-tag-created': [string, number] };
  };
  meta: { key: string; value: Meta };
}

export type Db = IDBPDatabase<NotesDB>;

// Bump this whenever the schema changes. `upgrade` runs only when the browser
// has an older version, so each step must be incremental and idempotent per version.
const VERSION = 3;

export function getDb(): Promise<Db> {
  return openDB<NotesDB>('notes-poc', VERSION, {
    async upgrade(db, oldVersion, _newVersion, tx) {
      // Fall-through migrations: a fresh user runs v1 -> v2 -> v3, an old user only the missing steps.
      if (oldVersion < 1) {
        const notes = db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
        notes.createIndex('by-tag', 'tag');
      }
      if (oldVersion < 2) {
        // v2: add a date index. Indexes can be added to an existing store via the upgrade transaction.
        tx.objectStore('notes').createIndex('by-created', 'createdAt');
        db.createObjectStore('meta', { keyPath: 'key' });
      }
      if (oldVersion < 3) {
        // v3: compound index [tag, createdAt] enables "notes of tag X in a date range" in a single lookup.
        const notes = tx.objectStore('notes');
        notes.createIndex('by-tag-created', ['tag', 'createdAt']);
        // Data migration happens inside the same upgrade transaction: it is atomic with the schema change.
        let cursor = await notes.openCursor();
        while (cursor) {
          if (!cursor.value.tag) await cursor.update({ ...cursor.value, tag: 'inbox' });
          cursor = await cursor.continue();
        }
        await tx.objectStore('meta').put({ key: 'migratedToV3At', value: Date.now() });
      }
    },
    blocked() {
      console.warn('Upgrade blocked: close other tabs using an older version of this DB.');
    },
    terminated() {
      console.error('The browser closed the connection unexpectedly.');
    },
  });
}
