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
//
// Aula 8 — TODA query agora leva `user_id` no WHERE.
//
// Este é o ponto mais importante da aula: o escopo por usuário mora no SQL,
// não numa checagem depois. Se fosse `findById(id)` seguido de
// `if (task.userId !== user.sub) throw`, bastaria alguém esquecer o if numa
// rota nova pra virar IDOR — acessar recurso alheio só chutando o id.
// Do jeito que está, pedir a task de outro usuário simplesmente não retorna nada.

interface TaskRow {
  id: number;
  title: string;
  done: number;
  user_id: number;
  created_at: string;
}

function rowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    done: row.done === 1,
    userId: row.user_id,
    createdAt: row.created_at,
  };
}

const statements = {
  findAll: db.prepare('SELECT * FROM tasks WHERE user_id = ? ORDER BY id'),
  findById: db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?'),
  insert: db.prepare('INSERT INTO tasks (title, done, user_id) VALUES (?, ?, ?)'),
  updateTitle: db.prepare('UPDATE tasks SET title = ? WHERE id = ? AND user_id = ?'),
  updateDone: db.prepare('UPDATE tasks SET done = ? WHERE id = ? AND user_id = ?'),
  delete: db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?'),
};

export const tasksRepository = {
  findAll(userId: number): Task[] {
    return statements.findAll.all(userId).map((r) => rowToTask(r as TaskRow));
  },

  findById(id: number, userId: number): Task | null {
    const row = statements.findById.get(id, userId) as TaskRow | undefined;
    return row ? rowToTask(row) : null;
  },

  insert(title: string, userId: number): Task {
    const result = statements.insert.run(title, 0, userId);
    return this.findById(Number(result.lastInsertRowid), userId)!;
  },

  update(id: number, userId: number, patch: { title?: string; done?: boolean }): Task | null {
    if (patch.title !== undefined) statements.updateTitle.run(patch.title, id, userId);
    if (patch.done !== undefined) statements.updateDone.run(patch.done ? 1 : 0, id, userId);
    return this.findById(id, userId);
  },

  delete(id: number, userId: number): Task | null {
    const task = this.findById(id, userId);
    if (!task) return null;
    statements.delete.run(id, userId);
    return task;
  },
};
