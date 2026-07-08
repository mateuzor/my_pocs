import Database from 'better-sqlite3';
import { dirname } from 'node:path';
import { mkdirSync } from 'node:fs';
import { env } from '../env.js';

// Aula 6 — Conexão com SQLite via better-sqlite3
//
// Por que better-sqlite3 em vez do sqlite3 clássico?
//   - API SÍNCRONA (Node bloqueia sim, mas SQLite é local, in-process)
//   - Muito mais rápido para o uso típico
//   - Sem callback/promise pra query trivial → código mais limpo
//
// Em bancos remotos (Postgres, MySQL), a lib SEMPRE é async — vc não pode
// bloquear o event loop esperando I/O de rede. SQLite é caso à parte.

// Garante que a pasta do banco existe antes de abrir a conexão
mkdirSync(dirname(env.DATABASE_URL), { recursive: true });

// A conexão é um SINGLETON — abre uma vez no startup, reutiliza em toda a app.
// better-sqlite3 é seguro pra ser compartilhado entre requests concorrentes.
export const db = new Database(env.DATABASE_URL);

// WAL mode = write-ahead logging — permite leituras concorrentes com escritas.
// É o modo recomendado pra aplicações web servidas por SQLite.
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
