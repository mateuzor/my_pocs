import { Router } from 'express';
import { tasksController } from '../controllers/tasks.controller.js';

// Aula 5 — Camada de ROTAS
//
// Responsabilidade: mapear método + path → função do controller.
// Zero código de negócio, zero validação — só o "diagrama de rotas".
//
// express.Router() cria um mini-app montável. Todas as rotas daqui
// vão ser prefixadas em app.use('/tasks', tasksRouter).

export const tasksRouter = Router();

tasksRouter.get('/', tasksController.list);
tasksRouter.get('/:id', tasksController.getById);
tasksRouter.post('/', tasksController.create);
tasksRouter.put('/:id', tasksController.update);
tasksRouter.delete('/:id', tasksController.remove);
