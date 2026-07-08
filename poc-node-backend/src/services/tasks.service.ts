import { NotFoundError } from '../errors.js';
import { tasksRepository } from '../repositories/tasks.repository.js';
import type { CreateTaskInput, UpdateTaskInput } from '../schemas.js';

// Aula 6 — Service agora delega a persistência ao REPOSITORY.
//
// O service continuou responsável POR:
//   - regras de negócio (validações que não são de payload — payload já foi
//     validado pelo Zod no controller)
//   - orquestração (chamar múltiplos repositórios se precisar)
//   - erros de domínio (NotFoundError vem daqui, não do repo)
//
// O service NÃO fala SQL. Trocar SQLite por Postgres = mexer só no
// repository. A assinatura das funções do service não muda.

export interface Task {
  id: number;
  title: string;
  done: boolean;
  createdAt: string;
}

export const tasksService = {
  list(): Task[] {
    return tasksRepository.findAll();
  },

  findById(id: number): Task {
    const task = tasksRepository.findById(id);
    if (!task) throw new NotFoundError('Task');
    return task;
  },

  create(input: CreateTaskInput): Task {
    return tasksRepository.insert(input.title);
  },

  update(id: number, input: UpdateTaskInput): Task {
    // Garante 404 antes de tentar atualizar
    this.findById(id);
    const updated = tasksRepository.update(id, input);
    if (!updated) throw new NotFoundError('Task');
    return updated;
  },

  remove(id: number): Task {
    const removed = tasksRepository.delete(id);
    if (!removed) throw new NotFoundError('Task');
    return removed;
  },
};
