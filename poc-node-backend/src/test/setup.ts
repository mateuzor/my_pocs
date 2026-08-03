import { beforeEach } from 'vitest';
import { db } from '../db/connection.js';

// Aula 7 — Setup global dos testes
//
// Roda uma vez por arquivo de teste, antes de tudo. Cria o schema no banco
// em memória (o migrate.ts "de verdade" também dá seed e fecha a conexão,
// então não dá pra reaproveitar aqui — testes querem controle total).

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// ISOLAMENTO: cada teste começa com a tabela vazia e o autoincrement zerado.
// Sem isso, um teste que cria uma task quebra o próximo que espera id = 1 —
// o clássico teste que passa sozinho e falha na suíte inteira.
beforeEach(() => {
  db.exec('DELETE FROM tasks');
  db.exec("DELETE FROM sqlite_sequence WHERE name = 'tasks'");
});
