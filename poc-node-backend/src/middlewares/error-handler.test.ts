import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { authFor } from '../test/helpers.js';

// Aula 7 — Testando os CAMINHOS DE ERRO
//
// O caminho feliz normalmente já é exercitado à mão durante o desenvolvimento.
// Os caminhos de erro não: ninguém fica mandando payload inválido no Insomnia
// toda vez que mexe no código. São justamente eles que quebram calados.
//
// Cada teste aqui prova um CONTRATO da API — o formato do erro que o cliente
// vai receber. Se alguém mudar o error-handler, estes testes acusam.

const app = createApp();

// Aula 8 — as rotas de /tasks passaram a exigir token, então os testes de
// validação precisam autenticar antes. O 401 vem ANTES do 400: sem token,
// a request nem chega no Zod.
let auth: Awaited<ReturnType<typeof authFor>>;

beforeEach(async () => {
  auth = await authFor(app);
});

describe('validação (Zod → 400)', () => {
  it('rejeita title vazio com VALIDATION_ERROR e lista os issues', async () => {
    const res = await request(app).post('/tasks').set('Authorization', auth.header).send({ title: '' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
    // `issues` é o flatten do Zod — é o que deixa o cliente mostrar erro por campo
    expect(res.body.issues).toHaveProperty('title');
  });

  it('rejeita body sem title', async () => {
    const res = await request(app).post('/tasks').set('Authorization', auth.header).send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
  });

  it('rejeita done com tipo errado no update', async () => {
    const res = await request(app).put('/tasks/1').set('Authorization', auth.header).send({ done: 'sim' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
  });
});

describe('recurso inexistente (NotFoundError → 404)', () => {
  it('GET /tasks/:id de id que não existe', async () => {
    const res = await request(app).get('/tasks/999').set('Authorization', auth.header);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: 'NOT_FOUND',
      message: 'Task não encontrado',
    });
  });

  it('DELETE de id que não existe', async () => {
    const res = await request(app).delete('/tasks/999').set('Authorization', auth.header);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('NOT_FOUND');
  });

  // A validação de payload roda ANTES do 404 — por isso um PUT inválido
  // num id inexistente devolve 400, não 404. Ordem importa e está testada.
  it('PUT inválido em id inexistente devolve 400, não 404', async () => {
    const res = await request(app).put('/tasks/999').set('Authorization', auth.header).send({ done: 'sim' });

    expect(res.status).toBe(400);
  });
});

describe('rota desconhecida', () => {
  it('cai no notFoundHandler com o mesmo formato de erro', async () => {
    const res = await request(app).get('/nao-existe');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: 'NOT_FOUND',
      message: 'Rota não encontrado',
    });
  });
});
