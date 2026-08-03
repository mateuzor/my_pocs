import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tasksService } from './tasks.service.js';
import { tasksRepository } from '../repositories/tasks.repository.js';
import { NotFoundError } from '../errors.js';

// Aula 7 — TESTE UNITÁRIO da camada de serviço
//
// "Unitário" aqui quer dizer: testar o service SEM banco. O repositório
// inteiro vira um dublê. Isso só é possível porque a aula 5/6 separou as
// camadas — se o service falasse SQL direto, este teste seria impossível
// sem subir um banco. Testabilidade é consequência de arquitetura.
//
// vi.mock substitui o módulo inteiro por funções espiãs. O caminho tem que
// ser IDÊNTICO ao do import acima (incluindo o .js do ESM).
vi.mock('../repositories/tasks.repository.js', () => ({
  tasksRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const repo = vi.mocked(tasksRepository);

const fakeTask = {
  id: 1,
  title: 'Estudar Node',
  done: false,
  createdAt: '2026-08-03 07:00:00',
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('tasksService.list', () => {
  it('repassa o que o repositório devolve', () => {
    repo.findAll.mockReturnValue([fakeTask]);

    expect(tasksService.list()).toEqual([fakeTask]);
    expect(repo.findAll).toHaveBeenCalledOnce();
  });
});

describe('tasksService.findById', () => {
  it('devolve a task quando existe', () => {
    repo.findById.mockReturnValue(fakeTask);

    expect(tasksService.findById(1)).toEqual(fakeTask);
  });

  // A regra de negócio que estamos provando: quem transforma "não achei"
  // (null do repo) em erro de domínio é o SERVICE, não o repositório.
  it('lança NotFoundError quando o repositório devolve null', () => {
    repo.findById.mockReturnValue(null);

    expect(() => tasksService.findById(99)).toThrow(NotFoundError);
  });
});

describe('tasksService.create', () => {
  it('passa só o title adiante', () => {
    repo.insert.mockReturnValue(fakeTask);

    const created = tasksService.create({ title: 'Estudar Node' });

    expect(created).toEqual(fakeTask);
    expect(repo.insert).toHaveBeenCalledWith('Estudar Node');
  });
});

describe('tasksService.update', () => {
  it('checa existência ANTES de atualizar', () => {
    repo.findById.mockReturnValue(fakeTask);
    repo.update.mockReturnValue({ ...fakeTask, done: true });

    const updated = tasksService.update(1, { done: true });

    expect(updated.done).toBe(true);
    // Prova a ordem: findById (guarda de 404) roda antes do update
    expect(repo.findById).toHaveBeenCalledBefore(repo.update);
  });

  it('lança NotFoundError sem nem chamar o update', () => {
    repo.findById.mockReturnValue(null);

    expect(() => tasksService.update(99, { done: true })).toThrow(NotFoundError);
    expect(repo.update).not.toHaveBeenCalled();
  });
});

describe('tasksService.remove', () => {
  it('lança NotFoundError quando o delete não encontrou nada', () => {
    repo.delete.mockReturnValue(null);

    expect(() => tasksService.remove(99)).toThrow(NotFoundError);
  });
});
