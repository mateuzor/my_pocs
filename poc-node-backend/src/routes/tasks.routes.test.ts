import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { tasksRepository } from '../repositories/tasks.repository.js';
import { authFor } from '../test/helpers.js';

// Aula 7 — TESTE DE INTEGRAÇÃO
//
// Diferença pro unitário do service: aqui NADA é mockado. A requisição passa
// por express.json → logger → authenticate → router → controller → Zod →
// service → repository → SQLite (em memória) e volta. É o teste que pega os
// bugs de ligação entre camadas, que o unitário nunca vê.
//
// Aula 8 — toda request agora precisa do header Authorization.

const app = createApp();

let auth: Awaited<ReturnType<typeof authFor>>;

beforeEach(async () => {
  auth = await authFor(app);
});

describe('GET /tasks', () => {
  it('devolve lista vazia quando não há nada', async () => {
    const res = await request(app).get('/tasks').set('Authorization', auth.header);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('devolve as tasks do usuário', async () => {
    tasksRepository.insert('Estudar Node', auth.userId);

    const res = await request(app).get('/tasks').set('Authorization', auth.header);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toMatchObject({ id: 1, title: 'Estudar Node', done: false });
  });
});

describe('POST /tasks', () => {
  it('cria e devolve 201 com a task já vinculada ao dono', async () => {
    const res = await request(app)
      .post('/tasks')
      .set('Authorization', auth.header)
      .send({ title: 'Nova task' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 1, title: 'Nova task', done: false, userId: auth.userId });
  });

  it('aplica trim no title', async () => {
    const res = await request(app)
      .post('/tasks')
      .set('Authorization', auth.header)
      .send({ title: '   com espaços   ' });

    expect(res.body.title).toBe('com espaços');
  });
});

describe('PUT /tasks/:id', () => {
  it('atualiza o done', async () => {
    tasksRepository.insert('Estudar Node', auth.userId);

    const res = await request(app)
      .put('/tasks/1')
      .set('Authorization', auth.header)
      .send({ done: true });

    expect(res.status).toBe(200);
    expect(res.body.done).toBe(true);
  });
});

describe('DELETE /tasks/:id', () => {
  it('remove e devolve a task apagada', async () => {
    tasksRepository.insert('Some daqui', auth.userId);

    const del = await request(app).delete('/tasks/1').set('Authorization', auth.header);
    expect(del.status).toBe(200);
    expect(del.body.title).toBe('Some daqui');

    const list = await request(app).get('/tasks').set('Authorization', auth.header);
    expect(list.body).toEqual([]);
  });
});
