import request from 'supertest';
import type { Express } from 'express';

// Aula 8 — helper de teste: cria usuário e devolve o header pronto.
//
// Sem isso, cada teste protegido repetiria register + login + montar o
// Bearer. Helper de autenticação é a primeira coisa que aparece em toda
// suíte de API real.

export async function authFor(app: Express, email = 'mateus@example.com') {
  const password = 'senha-forte-123';
  await request(app).post('/auth/register').send({ email, password });
  const res = await request(app).post('/auth/login').send({ email, password });

  return {
    token: res.body.token as string,
    userId: res.body.user.id as number,
    header: `Bearer ${res.body.token}` as const,
  };
}
