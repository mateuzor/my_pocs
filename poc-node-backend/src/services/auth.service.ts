import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { usersRepository, type User } from '../repositories/users.repository.js';
import {
  refreshTokensRepository,
  generateRefreshToken,
} from '../repositories/refresh-tokens.repository.js';
import { AppError } from '../errors.js';
import { env } from '../env.js';

// Aula 8 — Autenticação: parte 1, senhas (mantida)
// Aula 11 — Autenticação: parte 2, refresh tokens
//
// A DIFERENÇA IMPORTANTE:
//   - ACCESS TOKEN (JWT): dura pouco (15 min). Autenticação em toda request.
//   - REFRESH TOKEN: dura muito (7 dias). Só usado UMA vez pra pedir um novo
//     par (access + refresh). Nunca vai em Authorization: Bearer nas rotas
//     comuns — só no /auth/refresh.
//
// POR QUÊ dois tokens?
//   Se o access token vazasse com validade de 7 dias, o atacante teria
//   acesso por 7 dias. Com 15 min, o dano é curto. O refresh só serve pra
//   renovar; ele mora em cookie httpOnly no cliente ou em storage seguro,
//   nunca é enviado em cada request.
//
// ROTAÇÃO: cada refresh gera UM refresh novo E revoga o antigo. Se um
// atacante tentar reusar o refresh vazado, ele já foi revogado.

const SALT_ROUNDS = 10;

export class EmailAlreadyExistsError extends AppError {
  constructor() {
    super('Email já cadastrado', 409, 'EMAIL_ALREADY_EXISTS');
  }
}

export class InvalidCredentialsError extends AppError {
  constructor() {
    // Mensagem genérica: não vazar se email existe ou senha errou.
    super('Credenciais inválidas', 401, 'INVALID_CREDENTIALS');
  }
}

export class InvalidRefreshTokenError extends AppError {
  constructor() {
    // Também genérico. Não diz se expirou, foi revogado, ou nunca existiu.
    super('Refresh token inválido', 401, 'INVALID_REFRESH_TOKEN');
  }
}

export interface TokenPayload {
  sub: number;
  email: string;
}

// Helper que centraliza a geração do par (access + refresh) e a persistência do refresh.
function issueTokenPair(user: User): { token: string; refreshToken: string } {
  const payload: TokenPayload = { sub: user.id, email: user.email };
  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });

  const refreshToken = generateRefreshToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + env.REFRESH_TOKEN_EXPIRES_DAYS);
  refreshTokensRepository.store(user.id, refreshToken, expiresAt);

  return { token, refreshToken };
}

export const authService = {
  async register(email: string, password: string): Promise<User> {
    if (usersRepository.findByEmailWithPassword(email)) {
      throw new EmailAlreadyExistsError();
    }
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    return usersRepository.insert(email, passwordHash);
  },

  async login(
    email: string,
    password: string
  ): Promise<{ token: string; refreshToken: string; user: User }> {
    const found = usersRepository.findByEmailWithPassword(email);
    if (!found || !(await bcrypt.compare(password, found.passwordHash))) {
      throw new InvalidCredentialsError();
    }
    const { passwordHash: _discard, ...user } = found;
    return { ...issueTokenPair(user), user };
  },

  // Rotação: gasta o refresh atual, emite um par novo.
  // Se o refresh não existe / expirou / foi revogado, erro único genérico.
  refresh(providedRefreshToken: string): { token: string; refreshToken: string } {
    const active = refreshTokensRepository.findActive(providedRefreshToken);
    if (!active) throw new InvalidRefreshTokenError();

    const user = usersRepository.findById(active.userId);
    if (!user) throw new InvalidRefreshTokenError();

    // REVOGA o refresh usado ANTES de emitir o novo. Se alguém tentar
    // reusar o mesmo refresh, já era.
    refreshTokensRepository.revoke(active.id);
    return issueTokenPair(user);
  },

  // Logout global: revoga TODOS os refreshes vivos do usuário.
  // O access ainda vale até expirar (15 min) — pra invalidar imediatamente
  // precisaria de blacklist. Pra esta POC, a duração curta faz o trabalho.
  logout(userId: number): void {
    refreshTokensRepository.revokeAllForUser(userId);
  },

  verifyToken(token: string): TokenPayload {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  },
};
