import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { tasksRepository } from '../repositories/tasks.repository.js';

// Aula 7 — TESTE DE INTEGRAÇÃO
//
// Diferença pro unitário do service: aqui NADA é mockado. A requisição passa
// por express.json → logger → router → controller → Zod → service →
// repository → SQLite (em memória) e volta. É o teste que pega os bugs de
// ligação entre camadas, que o unitário nunca vê.
//
// supertest sobe o app numa porta efêmera, faz a request de verdade e
// encerra. Por isso o app.ts precisou parar de chamar listen() sozinho.

const app = createApp();

describe('GET /tasks', () => {
  it('devolve lista vazia quando não há nada', async () => {
    const res = await request(app).get('/tasks');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('devolve as tasks existentes', async () => {
    tasksRepository.insert('Estudar Node');

    const res = await request(app).get('/tasks');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toMatchObject({ id: 1, title: 'Estudar Node', done: false });
  });
});

describe('POST /tasks', () => {
  it('cria e devolve 201 com a task', async () => {
    const res = await request(app).post('/tasks').send({ title: 'Nova task' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 1, title: 'Nova task', done: false });
  });

  // O trim vem do schema Zod (.trim()), não do controller — mas do lado de
  // fora isso é invisível. O teste descreve o COMPORTAMENTO da API.
  it('aplica trim no title', async () => {
    const res = await request(app).post('/tasks').send({ title: '   com espaços   ' });

    expect(res.body.title).toBe('com espaços');
  });
});

describe('PUT /tasks/:id', () => {
  it('atualiza o done', async () => {
    tasksRepository.insert('Estudar Node');

    const res = await request(app).put('/tasks/1').send({ done: true });

    expect(res.status).toBe(200);
    expect(res.body.done).toBe(true);
  });
});

describe('DELETE /tasks/:id', () => {
  it('remove e devolve a task apagada', async () => {
    tasksRepository.insert('Some daqui');

    const del = await request(app).delete('/tasks/1');
    expect(del.status).toBe(200);
    expect(del.body.title).toBe('Some daqui');

    // Confirma que sumiu mesmo, não só que a resposta foi bonita
    const list = await request(app).get('/tasks');
    expect(list.body).toEqual([]);
  });
});
