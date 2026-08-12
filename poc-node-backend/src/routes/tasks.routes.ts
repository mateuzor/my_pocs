import { Router } from 'express';
import { tasksController } from '../controllers/tasks.controller.js';
import { authenticate } from '../middlewares/authenticate.js';

// Aula 5 — Router de tasks.
// Aula 8 — protegido por `authenticate` (todas as rotas).
// Aula 14 — documentado via JSDoc @openapi (lido por swagger-jsdoc).

export const tasksRouter = Router();

tasksRouter.use(authenticate);

/**
 * @openapi
 * /tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: Lista tasks do usuário autenticado
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Lista de tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Task' }
 */
tasksRouter.get('/', tasksController.list);

/**
 * @openapi
 * /tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Busca task por id
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Task
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Task' }
 *       404: { description: Não encontrada }
 */
tasksRouter.get('/:id', tasksController.getById);

/**
 * @openapi
 * /tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Cria uma task
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string, minLength: 1, maxLength: 200 }
 *     responses:
 *       201:
 *         description: Criada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Task' }
 */
tasksRouter.post('/', tasksController.create);

/**
 * @openapi
 * /tasks/{id}:
 *   put:
 *     tags: [Tasks]
 *     summary: Atualiza task
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               done: { type: boolean }
 *     responses:
 *       200: { description: Atualizada }
 *       404: { description: Não encontrada }
 */
tasksRouter.put('/:id', tasksController.update);

/**
 * @openapi
 * /tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Remove task
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Removida }
 *       404: { description: Não encontrada }
 */
tasksRouter.delete('/:id', tasksController.remove);
