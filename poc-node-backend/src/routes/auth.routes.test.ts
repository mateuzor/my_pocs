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

describe('POST /auth/login', () => {
  const credentials = { email: 'mateus@example.com', password: 'senha-forte-123' };

  async function registerUser() {
    await request(app).post('/auth/register').send(credentials);
  }

  it('devolve token e user quando as credenciais batem', async () => {
    await registerUser();

    const res = await request(app).post('/auth/login').send(credentials);

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTypeOf('string');
    expect(res.body.user).toMatchObject({ id: 1, email: credentials.email });
    expect(res.body.user).not.toHaveProperty('passwordHash');
  });

  it('emite um JWT com sub e email no payload', async () => {
    await registerUser();
    const res = await request(app).post('/auth/login').send(credentials);

    // Um JWT é header.payload.signature em base64url — dá pra ler o payload
    // sem o segredo. É exatamente por isso que não se põe dado sensível nele.
    const [, payloadB64] = res.body.token.split('.');
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());

    expect(payload.sub).toBe(1);
    expect(payload.email).toBe(credentials.email);
    expect(payload.exp).toBeGreaterThan(payload.iat);
  });

  // Os dois testes abaixo provam que a resposta é IDÊNTICA nos dois casos —
  // é isso que impede alguém de descobrir quais emails existem.
  it('senha errada devolve 401 genérico', async () => {
    await registerUser();

    const res = await request(app)
      .post('/auth/login')
      .send({ ...credentials, password: 'senha-errada' });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'INVALID_CREDENTIALS', message: 'Credenciais inválidas' });
  });

  it('email inexistente devolve o MESMO 401 genérico', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'ninguem@example.com', password: 'qualquer-senha' });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'INVALID_CREDENTIALS', message: 'Credenciais inválidas' });
  });
});
