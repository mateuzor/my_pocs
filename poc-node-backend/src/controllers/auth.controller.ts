import type { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { registerSchema } from '../schemas.js';

// Aula 8 — Controller de autenticação
//
// Mesma fatia fina da aula 5: valida → chama service → formata response.
// Note que o controller é `async` agora, porque bcrypt.hash é assíncrono
// (roda em thread pool para não travar o event loop).

export const authController = {
  async register(req: Request, res: Response) {
    const input = registerSchema.parse(req.body);
    const user = await authService.register(input.email, input.password);
    res.status(201).json(user);
  },
};
