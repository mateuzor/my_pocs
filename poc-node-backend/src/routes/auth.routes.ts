import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { asyncHandler } from '../middlewares/async-handler.js';
import { authenticate } from '../middlewares/authenticate.js';

// Aula 8 — Rotas de autenticação, montadas em /auth
// Aula 11 — adicionadas /refresh (pública) e /logout (autenticada).
// Aula 14 — documentadas via JSDoc @openapi (lido por swagger-jsdoc).

export const authRouter = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Cria um usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 8, maxLength: 72 }
 *     responses:
 *       201:
 *         description: Usuário criado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       409:
 *         description: Email já cadastrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
authRouter.post('/register', asyncHandler(authController.register));

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login — devolve access + refresh tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *                 refreshToken: { type: string }
 *                 user: { $ref: '#/components/schemas/User' }
 *       401:
 *         description: Credenciais inválidas
 */
authRouter.post('/login', asyncHandler(authController.login));

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Rotaciona o refresh token e devolve um novo par
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200: { description: Novo par }
 *       401: { description: Refresh inválido / expirado / revogado }
 */
authRouter.post('/refresh', asyncHandler(authController.refresh));

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Revoga todos os refresh tokens do usuário
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204: { description: OK }
 *       401: { description: Não autenticado }
 */
authRouter.post('/logout', authenticate, asyncHandler(authController.logout));
