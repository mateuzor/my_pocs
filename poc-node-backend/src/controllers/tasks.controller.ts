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

export const tasksController = {
  list(_req: Request, res: Response) {
    const items = tasksService.list();
    res.json(items);
  },

  getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const task = tasksService.findById(id);
    res.json(task);
  },

  create(req: Request, res: Response) {
    const input = createTaskSchema.parse(req.body);
    const task = tasksService.create(input);
    res.status(201).json(task);
  },

  update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const input = updateTaskSchema.parse(req.body);
    const task = tasksService.update(id, input);
    res.json(task);
  },

  remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    const removed = tasksService.remove(id);
    res.json(removed);
  },
};
