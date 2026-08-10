import { sql } from 'drizzle-orm';
import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';

// Aula 12 — Schema definido em TypeScript com Drizzle
//
// A migração é do "SQL na mão" (aula 6) pra SCHEMA VERSIONADO. A diferença:
//
//   ANTES: `CREATE TABLE IF NOT EXISTS` — idempotente, mas incapaz de
//          ALTERAR uma tabela existente. Adicionar coluna = wipe do banco
//          (foi exatamente a dor documentada no README na aula 8).
//
//   AGORA: Drizzle compara este schema TS com um snapshot do último estado
//          e GERA o SQL de diff (`ALTER TABLE ADD COLUMN`, etc). Cada
//          migração vira um arquivo versionado em ./drizzle/, aplicado
//          exatamente uma vez, rastreado numa tabela `__drizzle_migrations`.
//
// Comandos:
//   npm run db:generate   — Drizzle olha o diff e cria drizzle/NNNN_*.sql
//   npm run db:migrate    — aplica pendentes ao banco
//
// Estas tabelas espelham o schema das aulas 6, 8 e 11. O objetivo é reproduzir
// o estado atual sem quebrar as repositories (que continuam usando SQL cru).

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
});

export const tasks = sqliteTable(
  'tasks',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    // SQLite não tem boolean → 0/1. Drizzle expõe como number.
    done: integer('done').notNull().default(0),
    // ON DELETE CASCADE modela a relação: deletou usuário, some as tasks dele.
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  },
  (table) => ({
    doneIdx: index('idx_tasks_done').on(table.done),
    userIdx: index('idx_tasks_user').on(table.userId),
  })
);

// Aula 11 — refresh tokens versionados também
export const refreshTokens = sqliteTable(
  'refresh_tokens',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: text('token_hash').notNull().unique(),
    expiresAt: text('expires_at').notNull(),
    revokedAt: text('revoked_at'),
    createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  },
  (table) => ({
    hashIdx: index('idx_refresh_hash').on(table.tokenHash),
    userIdx: index('idx_refresh_user').on(table.userId),
  })
);
