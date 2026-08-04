import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { usersRepository } from '../repositories/users.repository.js';

// Aula 8 — Testes do registro
//
// O teste mais importante deste arquivo é o "não devolve o hash": é o tipo
// de vazamento que passa despercebido em code review e nunca dá erro.

const app = createApp();

describe('POST /auth/register', () => {
  it('cria o usuário e devolve 201', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'mateus@example.com', password: 'senha-forte-123' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 1, email: 'mateus@example.com' });
  });

  it('NUNCA devolve o hash da senha na response', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'mateus@example.com', password: 'senha-forte-123' });

    expect(res.body).not.toHaveProperty('passwordHash');
    expect(res.body).not.toHaveProperty('password_hash');
    expect(res.body).not.toHaveProperty('password');
  });

  it('guarda um hash, não a senha em claro', async () => {
    await request(app)
      .post('/auth/register')
      .send({ email: 'mateus@example.com', password: 'senha-forte-123' });

    const stored = usersRepository.findByEmailWithPassword('mateus@example.com');

    expect(stored!.passwordHash).not.toBe('senha-forte-123');
    // $2b$ é o prefixo do formato bcrypt — prova o algoritmo, não só "mudou"
    expect(stored!.passwordHash).toMatch(/^\$2[aby]\$/);
  });

  it('normaliza o email para minúsculo (schema faz o toLowerCase)', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: '  MaTeus@Example.COM ', password: 'senha-forte-123' });

    expect(res.body.email).toBe('mateus@example.com');
  });

  it('rejeita email duplicado com 409', async () => {
    const body = { email: 'mateus@example.com', password: 'senha-forte-123' };
    await request(app).post('/auth/register').send(body);

    const res = await request(app).post('/auth/register').send(body);

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('EMAIL_ALREADY_EXISTS');
  });

  it('rejeita senha curta com 400', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'mateus@example.com', password: '123' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
  });

  it('rejeita email inválido com 400', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'nao-e-email', password: 'senha-forte-123' });

    expect(res.status).toBe(400);
  });
});
