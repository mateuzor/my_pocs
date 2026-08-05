import type { Request, Response } from 'express';
import { tasksService } from '../services/tasks.service.js';
import { createTaskSchema, updateTaskSchema } from '../schemas.js';

// Aula 5 — Camada de CONTROLLER
//
// Responsabilidade: traduzir HTTP ↔ chamada de serviço.
//   1. extrai dados de req (params, body, query)
//   2. valida com Zod
//   3. chama service
//   4. formata response (status + json)
//
// NÃO tem regra de negócio. Não sabe onde os dados moram.
// Cada função é fina e vira teste unitário trivial.

// Aula 8 — o id do usuário vem do TOKEN (req.user), nunca do body ou da query.
// Se viesse do cliente, qualquer um mandaria userId=1 e leria as tasks alheias.
// O `!` é seguro porque o router só monta estes controllers atrás do
// middleware `authenticate`, que garante req.user preenchido.

export const tasksController = {
  list(req: Request, res: Response) {
    const items = tasksService.list(req.user!.sub);
    res.json(items);
  },

  getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const task = tasksService.findById(id, req.user!.sub);
    res.json(task);
  },

  create(req: Request, res: Response) {
    const input = createTaskSchema.parse(req.body);
    const task = tasksService.create(input, req.user!.sub);
    res.status(201).json(task);
  },

  update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const input = updateTaskSchema.parse(req.body);
    const task = tasksService.update(id, input, req.user!.sub);
    res.json(task);
  },

  remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    const removed = tasksService.remove(id, req.user!.sub);
    res.json(removed);
  },
};
