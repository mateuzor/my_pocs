import type { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { registerSchema, loginSchema, refreshSchema } from '../schemas.js';

// Aula 8 — Controller de autenticação
// Aula 11 — adicionados refresh e logout.
//
// login e refresh devolvem AMBOS os tokens no body.
// Numa app web real, o refresh iria em cookie httpOnly SameSite=Strict pra
// não ficar acessível a JS (defesa contra XSS roubar). Aqui deixamos no body
// pra simplificar o consumo por curl/tests.

export const authController = {
  async register(req: Request, res: Response) {
    const input = registerSchema.parse(req.body);
    const user = await authService.register(input.email, input.password);
    res.status(201).json(user);
  },

  async login(req: Request, res: Response) {
    const input = loginSchema.parse(req.body);
    const { token, refreshToken, user } = await authService.login(input.email, input.password);
    res.json({ token, refreshToken, user });
  },

  refresh(req: Request, res: Response) {
    const input = refreshSchema.parse(req.body);
    const pair = authService.refresh(input.refreshToken);
    res.json(pair);
  },

  // Logout: revoga TODOS os refresh tokens do usuário autenticado.
  // req.user vem do middleware `authenticate` (aula 8).
  logout(req: Request, res: Response) {
    const userId = (req as { user?: { sub: number } }).user!.sub;
    authService.logout(userId);
    res.status(204).end();
  },
};
