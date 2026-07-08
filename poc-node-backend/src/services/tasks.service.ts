import { NotFoundError } from '../errors.js';
import type { CreateTaskInput, UpdateTaskInput } from '../schemas.js';

// Aula 5 — Camada de SERVIÇO
//
// Responsabilidade: regras de negócio + interação com "banco" (por enquanto
// um array em memória). Não sabe NADA sobre HTTP — não recebe req/res, não
// retorna status code. Só regras + dados.
//
// Vantagens:
//   - Reutilizável (worker, CLI, testes chamam direto)
//   - Testável sem subir servidor HTTP
//   - Trocável (memória → SQLite → Postgres) sem mudar controller

export interface Task {
  id: number;
  title: string;
  done: boolean;
  createdAt: string;
}

// "Banco" em memória. Na próxima aula vira SQLite via repository.
const tasks: Task[] = [
  { id: 1, title: 'Estudar Node', done: true, createdAt: new Date().toISOString() },
  { id: 2, title: 'Fazer POC de backend', done: false, createdAt: new Date().toISOString() },
];
let nextId = 3;

export const tasksService = {
  list(): Task[] {
    return tasks;
  },

  findById(id: number): Task {
    const task = tasks.find((t) => t.id === id);
    if (!task) throw new NotFoundError('Task');
    return task;
  },

  create(input: CreateTaskInput): Task {
    const task: Task = {
      id: nextId++,
      title: input.title,
      done: false,
      createdAt: new Date().toISOString(),
    };
    tasks.push(task);
    return task;
  },

  update(id: number, input: UpdateTaskInput): Task {
    const task = this.findById(id); // reusa a lógica + 404
    if (input.title !== undefined) task.title = input.title;
    if (input.done !== undefined) task.done = input.done;
    return task;
  },

  remove(id: number): Task {
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) throw new NotFoundError('Task');
    const [removed] = tasks.splice(idx, 1);
    return removed;
  },
};
