import bcrypt from 'bcryptjs';
import { db } from './connection.js';

// Aula 6 — Migration MANUAL (sem lib de migração)
//
// Antes de usar Prisma/Drizzle/Knex, entender o que uma migration é:
// só um SQL que garante a estrutura do banco. `CREATE TABLE IF NOT EXISTS`
// é idempotente — dá pra rodar quantas vezes quiser sem quebrar.
//
// Chame com: `npm run db:migrate` (definido no package.json).

console.log(`Rodando migrations em ${db.name}...`);

// ORDEM IMPORTA: `users` primeiro, porque `tasks.user_id` referencia ela.
db.exec(`
  -- Aula 8 — usuários. UNIQUE no email é a garantia REAL de unicidade:
  -- checar "já existe?" no service é uma corrida (dois requests simultâneos
  -- passam os dois). O banco é quem arbitra de verdade.
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,               -- NUNCA a senha em claro
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0,           -- SQLite não tem bool, uso 0/1
    -- Aula 8 — dono da task. ON DELETE CASCADE: apagou o usuário, somem as
    -- tasks dele. Sem isso sobram linhas órfãs apontando pra um id que não existe.
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_tasks_done ON tasks(done);
  -- Toda query de task agora filtra por user_id — sem índice, full scan.
  CREATE INDEX IF NOT EXISTS idx_tasks_user ON tasks(user_id);
`);

// Seed inicial só se não houver usuário. Agora o seed precisa criar um dono
// antes das tasks, já que user_id é NOT NULL.
const users = db.prepare('SELECT COUNT(*) as c FROM users').get() as { c: number };
if (users.c === 0) {
  const passwordHash = bcrypt.hashSync('senha-forte-123', 10);
  const user = db
    .prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)')
    .run('mateus@example.com', passwordHash);
  const userId = Number(user.lastInsertRowid);

  const insert = db.prepare('INSERT INTO tasks (title, done, user_id) VALUES (?, ?, ?)');
  insert.run('Estudar Node', 1, userId);
  insert.run('Fazer POC de backend', 0, userId);

  console.log('Seed inserido: 1 usuário (mateus@example.com / senha-forte-123) + 2 tasks.');
}

console.log('Migrations OK.');
db.close();
