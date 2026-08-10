import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import bcrypt from 'bcryptjs';
import { db } from './connection.js';

// Aula 12 — Migration com Drizzle (versionada)
//
// A grande mudança em relação à aula 6:
//   ANTES  → `CREATE TABLE IF NOT EXISTS` (idempotente, mas ALTERAR era wipe)
//   AGORA  → `migrate()` aplica arquivos SQL versionados de ./drizzle/,
//            rastreando o que já rodou numa tabela __drizzle_migrations.
//
// Fluxo de trabalho:
//   1. Mexo em src/db/schema.ts
//   2. `npm run db:generate` — drizzle-kit compara com o snapshot anterior
//      e cria drizzle/0001_algum_nome.sql (só o diff)
//   3. `npm run db:migrate` — aplica os arquivos pendentes
//   4. Commito o schema TS + o SQL gerado + os metadados

console.log(`Rodando migrations em ${db.name}...`);

// drizzle() envolve a conexão better-sqlite3. Aqui só usamos pra migrator;
// as repositories continuam com SQL cru (não reescrevo tudo).
const drizzleDb = drizzle(db);

migrate(drizzleDb, { migrationsFolder: './drizzle' });

console.log('Migrations aplicadas.');

// -------------------------------------------------------------------
// SEED — só se o banco estiver vazio.
// Continua usando SQL cru pra manter simetria com o resto da aplicação.
// -------------------------------------------------------------------
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

db.close();
