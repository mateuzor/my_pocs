# poc-indexeddb

## What
IndexedDB is the browser's built-in transactional, indexed, asynchronous key/value-object database. This POC uses the tiny `idb` wrapper, which turns the event-based API into promises and adds TypeScript schemas. It covers object stores, indexes (single and compound), range queries with `IDBKeyRange`, cursors, transactions and versioned migrations.

## Why
localStorage is synchronous, string-only and capped at about 5 MB. IndexedDB handles large structured data, supports querying by index without loading everything into memory, and works offline (PWAs, caches, drafts).

## How to run
```
npm install
npm run dev
```
Click "Seed", filter by tag and dates, run the cursor update, and try the transaction button. Inspect the data in DevTools > Application > IndexedDB. To see a migration, lower `VERSION` in `src/db.ts`, load, then raise it again.

## What to tell a mentor
- Schema changes only happen inside `upgrade`, driven by the DB version. I wrote migrations as `if (oldVersion < N)` steps so any old client reaches the latest schema.
- Data migrations run in the upgrade transaction, so schema and data change atomically.
- Queries go through indexes and `IDBKeyRange`; the compound index `[tag, createdAt]` answers "tag X in a date range" in one lookup.
- Cursors stream and update records in place; transactions auto-commit, and `tx.done` or `abort()` give all-or-nothing semantics.
- Trade-off: the API is low level, so `idb` (or Dexie) is worth it for ergonomics and types.
