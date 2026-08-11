import { Router } from 'express';
import { attachmentsController } from '../controllers/attachments.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { asyncHandler } from '../middlewares/async-handler.js';
import { upload } from '../middlewares/upload.js';

// Aula 13 — Rotas de anexos.
//
// Duas rotas ligadas à task (POST/GET /tasks/:id/attachments) e duas por id
// direto do anexo (GET/DELETE /attachments/:id/...).
//
// Router com prefixo próprio '/tasks' pra manter a nested convention REST.
// Poderia mover pro tasksRouter, mas fica mais legível separado.

export const attachmentsRouter = Router();

// Tudo autenticado
attachmentsRouter.use(authenticate);

// Nested em /tasks/:id
attachmentsRouter.post(
  '/tasks/:id/attachments',
  upload.single('file'), // multer processa o multipart e popula req.file
  attachmentsController.upload
);
attachmentsRouter.get('/tasks/:id/attachments', attachmentsController.list);

// Por id do anexo — download em stream, delete remove metadado + arquivo
attachmentsRouter.get('/attachments/:id/download', attachmentsController.download);
attachmentsRouter.delete('/attachments/:id', asyncHandler(attachmentsController.remove));
