import type { Request, Response } from 'express';
import { createReadStream } from 'node:fs';
import { unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { attachmentsRepository } from '../repositories/attachments.repository.js';
import { tasksService } from '../services/tasks.service.js';
import { NotFoundError, AppError } from '../errors.js';

// Aula 13 — Controller de anexos.
//
// Rotas montadas em /tasks/:id/attachments — precisam garantir que a task
// pertence ao usuário ANTES de salvar/listar anexo.
// tasksService.findById() já joga NotFoundError se a task não existe ou
// não é do usuário — reaproveito essa checagem.

const UPLOAD_DIR = './uploads';

function currentUserId(req: Request): number {
  return (req as { user?: { sub: number } }).user!.sub;
}

export const attachmentsController = {
  // POST /tasks/:id/attachments  (multer.single popula req.file)
  upload(req: Request, res: Response) {
    const taskId = Number(req.params.id);
    const userId = currentUserId(req);

    // Garante que a task existe E é do usuário (senão anexaríamos a task alheia)
    tasksService.findById(taskId, userId);

    const file = req.file;
    if (!file) throw new AppError('Arquivo obrigatório em `file`', 400, 'FILE_REQUIRED');

    const attachment = attachmentsRepository.insert({
      taskId,
      originalName: file.originalname,
      storedName: file.filename,
      mimeType: file.mimetype,
      sizeBytes: file.size,
    });

    res.status(201).json(attachment);
  },

  // GET /tasks/:id/attachments — lista de anexos da task
  list(req: Request, res: Response) {
    const taskId = Number(req.params.id);
    const userId = currentUserId(req);
    tasksService.findById(taskId, userId);
    res.json(attachmentsRepository.listByTask(taskId, userId));
  },

  // GET /attachments/:id/download — stream do arquivo
  download(req: Request, res: Response) {
    const id = Number(req.params.id);
    const userId = currentUserId(req);
    const attachment = attachmentsRepository.findByIdForUser(id, userId);
    if (!attachment) throw new NotFoundError('Attachment');

    res.setHeader('content-type', attachment.mimeType);
    res.setHeader(
      'content-disposition',
      `attachment; filename="${encodeURIComponent(attachment.originalName)}"`
    );
    // Stream direto pra response — não carrega o arquivo em memória
    createReadStream(join(UPLOAD_DIR, attachment.storedName)).pipe(res);
  },

  // DELETE /attachments/:id — remove metadado e arquivo em disco
  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    const userId = currentUserId(req);
    const attachment = attachmentsRepository.findByIdForUser(id, userId);
    if (!attachment) throw new NotFoundError('Attachment');

    attachmentsRepository.delete(id);
    // Best-effort — se o arquivo já sumiu (rerun de teste), não falha a request
    await unlink(join(UPLOAD_DIR, attachment.storedName)).catch(() => {});

    res.status(204).end();
  },
};
