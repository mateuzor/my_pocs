import { db } from '../db/connection.js';
import type { Task } from '../services/tasks.service.js';

// Aula 6 — REPOSITORY pattern
//
// O repository é a CAMADA entre o serviço e o banco. Ele:
//   1. Sabe SQL (o serviço não)
//   2. Retorna entidades do domínio (não linhas cruas)
//   3. Isola o resto do código do storage — trocar SQLite por Postgres
//      significa reescrever SÓ este arquivo
//
// PADRÃO importante do better-sqlite3: statements sempre PREPARADOS
// (`db.prepare(...)`) — o SQLite compila o SQL uma vez e reutiliza. Isso
// é performance E segurança (parâmetros vão como bind, não interpolados).

// Linha crua do banco — SQLite não tem boolean, usa 0/1
interface TaskRow {
  id: number;
  title: string;
  done: number;
  created_at: string;
}

// Converte a linha em entidade do domínio (com boolean e camelCase)
function rowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    done: row.done === 1,
    createdAt: row.created_at,
  };
}

// Prepara os statements UMA VEZ na inicialização — reuso em toda call
const statements = {
  findAll: db.prepare('SELECT * FROM tasks ORDER BY id'),
  findById: db.prepare('SELECT * FROM tasks WHERE id = ?'),
  insert: db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)'),
  updateTitle: db.prepare('UPDATE tasks SET title = ? WHERE id = ?'),
  updateDone: db.prepare('UPDATE tasks SET done = ? WHERE id = ?'),
  delete: db.prepare('DELETE FROM tasks WHERE id = ?'),
};

export const tasksRepository = {
  findAll(): Task[] {
    // .all() retorna todas as linhas — tipado com o generic
    return statements.findAll.all<TaskRow>().map(rowToTask);
  },

  findById(id: number): Task | null {
    const row = statements.findById.get(id) as TaskRow | undefined;
    return row ? rowToTask(row) : null;
  },

  insert(title: string): Task {
    // .run() executa e retorna { changes, lastInsertRowid }
    const result = statements.insert.run(title, 0);
    return this.findById(Number(result.lastInsertRowid))!;
  },

  update(id: number, patch: { title?: string; done?: boolean }): Task | null {
    if (patch.title !== undefined) statements.updateTitle.run(patch.title, id);
    if (patch.done !== undefined) statements.updateDone.run(patch.done ? 1 : 0, id);
    return this.findById(id);
  },

  delete(id: number): Task | null {
    const task = this.findById(id);
    if (!task) return null;
    statements.delete.run(id);
    return task;
  },
};
