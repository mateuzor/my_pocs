import { db } from './connection.js';

// Aula 6 — Migration MANUAL (sem lib de migração)
//
// Antes de usar Prisma/Drizzle/Knex, entender o que uma migration é:
// só um SQL que garante a estrutura do banco. `CREATE TABLE IF NOT EXISTS`
// é idempotente — dá pra rodar quantas vezes quiser sem quebrar.
//
// Chame com: `npm run db:migrate` (definido no package.json).

console.log(`Rodando migrations em ${db.name}...`);

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0,           -- SQLite não tem bool, uso 0/1
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_tasks_done ON tasks(done);

  -- Aula 8 — usuários. UNIQUE no email é a garantia REAL de unicidade:
  -- checar "já existe?" no service é uma corrida (dois requests simultâneos
  -- passam os dois). O banco é quem arbitra de verdade.
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,           -- NUNCA a senha em claro
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// Seed inicial só se tabela estiver vazia
const count = db.prepare('SELECT COUNT(*) as c FROM tasks').get() as { c: number };
if (count.c === 0) {
  const insert = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)');
  insert.run('Estudar Node', 1);
  insert.run('Fazer POC de backend', 0);
  console.log('Seed inserido (2 tasks).');
}

console.log('Migrations OK.');
db.close();
