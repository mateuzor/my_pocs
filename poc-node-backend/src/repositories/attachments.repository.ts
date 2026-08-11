import { db } from '../db/connection.js';

// Aula 13 — Repository de attachments.
// SÓ metadados. O arquivo em si mora em ./uploads/ (ou em S3 em produção).
//
// Por que separar? Bancos são pra dados relacionais consultáveis; arquivos
// binários grandes matam performance (backup fica gigante, replicação lenta).

export interface Attachment {
  id: number;
  taskId: number;
  originalName: string;
  storedName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
}

interface AttachmentRow {
  id: number;
  task_id: number;
  original_name: string;
  stored_name: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
}

function rowToAttachment(row: AttachmentRow): Attachment {
  return {
    id: row.id,
    taskId: row.task_id,
    originalName: row.original_name,
    storedName: row.stored_name,
    mimeType: row.mime_type,
    sizeBytes: row.size_bytes,
    createdAt: row.created_at,
  };
}

// JOIN com tasks garante que o usuário só vê/apaga anexos de tasks DELE.
// Mesma lógica de segurança da aula 8: escopo no SQL, não em `if` depois.
const statements = {
  insert: db.prepare(
    'INSERT INTO attachments (task_id, original_name, stored_name, mime_type, size_bytes) VALUES (?, ?, ?, ?, ?)'
  ),
  findById: db.prepare('SELECT * FROM attachments WHERE id = ?'),
  findByTaskAndUser: db.prepare(`
    SELECT a.* FROM attachments a
    INNER JOIN tasks t ON t.id = a.task_id
    WHERE a.task_id = ? AND t.user_id = ?
    ORDER BY a.id
  `),
  findByIdAndUser: db.prepare(`
    SELECT a.* FROM attachments a
    INNER JOIN tasks t ON t.id = a.task_id
    WHERE a.id = ? AND t.user_id = ?
  `),
  delete: db.prepare('DELETE FROM attachments WHERE id = ?'),
};

export const attachmentsRepository = {
  insert(data: Omit<Attachment, 'id' | 'createdAt'>): Attachment {
    const result = statements.insert.run(
      data.taskId,
      data.originalName,
      data.storedName,
      data.mimeType,
      data.sizeBytes
    );
    const row = statements.findById.get(Number(result.lastInsertRowid)) as AttachmentRow;
    return rowToAttachment(row);
  },

  listByTask(taskId: number, userId: number): Attachment[] {
    return statements.findByTaskAndUser
      .all(taskId, userId)
      .map((r) => rowToAttachment(r as AttachmentRow));
  },

  findByIdForUser(id: number, userId: number): Attachment | null {
    const row = statements.findByIdAndUser.get(id, userId) as AttachmentRow | undefined;
    return row ? rowToAttachment(row) : null;
  },

  delete(id: number): void {
    statements.delete.run(id);
  },
};
