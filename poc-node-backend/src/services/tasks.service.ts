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
  userId: number;      // aula 8 — dono da task
  createdAt: string;
}

// Aula 8 — todo método recebe `userId`. Não existe "listar todas as tasks":
// existe "listar as tasks DESTE usuário". O escopo é parte da assinatura,
// então é impossível chamar sem decidir de quem é.
//
// Consequência de design: task de outro usuário devolve 404, não 403. Um 403
// confirmaria "existe, mas não é sua" — o 404 não vaza nem a existência.

export const tasksService = {
  list(userId: number): Task[] {
    return tasksRepository.findAll(userId);
  },

  findById(id: number, userId: number): Task {
    const task = tasksRepository.findById(id, userId);
    if (!task) throw new NotFoundError('Task');
    return task;
  },

  create(input: CreateTaskInput, userId: number): Task {
    return tasksRepository.insert(input.title, userId);
  },

  update(id: number, input: UpdateTaskInput, userId: number): Task {
    // Garante 404 antes de tentar atualizar
    this.findById(id, userId);
    const updated = tasksRepository.update(id, userId, input);
    if (!updated) throw new NotFoundError('Task');
    return updated;
  },

  remove(id: number, userId: number): Task {
    const removed = tasksRepository.delete(id, userId);
    if (!removed) throw new NotFoundError('Task');
    return removed;
  },
};
