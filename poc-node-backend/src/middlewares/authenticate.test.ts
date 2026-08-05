import { describe, it, expect } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { createApp } from '../app.js';
import { authFor } from '../test/helpers.js';
import { tasksRepository } from '../repositories/tasks.repository.js';
import { env } from '../env.js';

// Aula 8 — Testes do middleware de autenticação e do isolamento por usuário.
//
// A segunda parte (ISOLAMENTO) é o teste que realmente importa: prova que um
// usuário não alcança dado do outro. É a classe de bug (IDOR) que mais
// aparece em auditoria de API e que nenhum teste de caminho feliz pega.

const app = createApp();

describe('authenticate — token ausente ou malformado', () => {
  it('sem header devolve 401', async () => {
    const res = await request(app).get('/tasks');

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('UNAUTHORIZED');
  });

  it('header sem o prefixo Bearer devolve 401', async () => {
    const { token } = await authFor(app);

    const res = await request(app).get('/tasks').set('Authorization', token);

    expect(res.status).toBe(401);
  });

  it('token com assinatura inválida devolve 401', async () => {
    // Token bem formado, assinado com OUTRO segredo. É o caso que prova que
    // a verificação é criptográfica, e não só "tem três partes separadas por ponto".
    const forged = jwt.sign({ sub: 1, email: 'x@y.com' }, 'segredo-do-atacante');

    const res = await request(app).get('/tasks').set('Authorization', `Bearer ${forged}`);

    expect(res.status).toBe(401);
  });

  it('token expirado devolve 401 com mensagem específica', async () => {
    const expired = jwt.sign({ sub: 1, email: 'x@y.com' }, env.JWT_SECRET, { expiresIn: '-1s' });

    const res = await request(app).get('/tasks').set('Authorization', `Bearer ${expired}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Token expirado');
  });
});

describe('isolamento entre usuários (IDOR)', () => {
  it('a lista só traz as tasks do próprio usuário', async () => {
    const ana = await authFor(app, 'ana@example.com');
    const bob = await authFor(app, 'bob@example.com');

    tasksRepository.insert('Task da Ana', ana.userId);
    tasksRepository.insert('Task do Bob', bob.userId);

    const res = await request(app).get('/tasks').set('Authorization', ana.header);

    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe('Task da Ana');
  });

  it('GET de task alheia devolve 404 (não 403 — não vaza nem a existência)', async () => {
    const ana = await authFor(app, 'ana@example.com');
    const bob = await authFor(app, 'bob@example.com');

    const taskDoBob = tasksRepository.insert('Task do Bob', bob.userId);

    const res = await request(app)
      .get(`/tasks/${taskDoBob.id}`)
      .set('Authorization', ana.header);

    expect(res.status).toBe(404);
  });

  it('não dá pra apagar task alheia', async () => {
    const ana = await authFor(app, 'ana@example.com');
    const bob = await authFor(app, 'bob@example.com');

    const taskDoBob = tasksRepository.insert('Task do Bob', bob.userId);

    const res = await request(app)
      .delete(`/tasks/${taskDoBob.id}`)
      .set('Authorization', ana.header);

    expect(res.status).toBe(404);
    // E continua lá pro dono
    expect(tasksRepository.findById(taskDoBob.id, bob.userId)).not.toBeNull();
  });

  it('não dá pra atualizar task alheia', async () => {
    const ana = await authFor(app, 'ana@example.com');
    const bob = await authFor(app, 'bob@example.com');

    const taskDoBob = tasksRepository.insert('Task do Bob', bob.userId);

    const res = await request(app)
      .put(`/tasks/${taskDoBob.id}`)
      .set('Authorization', ana.header)
      .send({ title: 'invadido' });

    expect(res.status).toBe(404);
    expect(tasksRepository.findById(taskDoBob.id, bob.userId)!.title).toBe('Task do Bob');
  });
});
