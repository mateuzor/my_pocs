import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { usersRepository, type User } from '../repositories/users.repository.js';
import { AppError } from '../errors.js';
import { env } from '../env.js';

// Aula 8 — Autenticação: parte 1, senhas
//
// REGRA Nº 1: senha nunca é guardada, nem criptografada. Guarda-se um HASH.
// Criptografia é reversível (existe uma chave que desfaz); hash não é. Se o
// banco vazar, o atacante não consegue "descriptografar" nada.
//
// Por que bcrypt e não SHA-256?
//   - bcrypt é DE PROPÓSITO lento. SHA-256 é rápido, e rapidez aqui é defeito:
//     permite bilhões de tentativas por segundo num ataque de força bruta.
//   - o custo é configurável (`SALT_ROUNDS`). Cada +1 dobra o tempo. Dá pra
//     aumentar conforme o hardware do mundo melhora, sem trocar de algoritmo.
//   - o SALT já vem embutido no hash gerado. Dois usuários com a mesma senha
//     produzem hashes diferentes, o que mata ataque por rainbow table.
const SALT_ROUNDS = 10;

export class EmailAlreadyExistsError extends AppError {
  constructor() {
    super('Email já cadastrado', 409, 'EMAIL_ALREADY_EXISTS');
  }
}

export class InvalidCredentialsError extends AppError {
  constructor() {
    // MENSAGEM GENÉRICA de propósito. Se respondesse "email não existe" vs
    // "senha errada", a API viraria um oráculo pra descobrir quais emails
    // estão cadastrados (user enumeration).
    super('Credenciais inválidas', 401, 'INVALID_CREDENTIALS');
  }
}

// O que vai DENTRO do token. Regra: só identificação, nunca dado sensível —
// o payload de um JWT é apenas base64, qualquer um lê. Assinatura garante
// que não foi ALTERADO, não que é secreto.
export interface TokenPayload {
  sub: number;   // "subject" — id do usuário, nome padrão pela RFC 7519
  email: string;
}

export const authService = {
  async register(email: string, password: string): Promise<User> {
    // Checagem amigável — dá uma mensagem melhor que "constraint violation".
    // Não é a garantia de unicidade: essa é o UNIQUE no schema.
    if (usersRepository.findByEmailWithPassword(email)) {
      throw new EmailAlreadyExistsError();
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // O repositório devolve `User`, que não tem passwordHash — então é
    // impossível vazar o hash na response mesmo se alguém quiser.
    return usersRepository.insert(email, passwordHash);
  },

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const found = usersRepository.findByEmailWithPassword(email);

    // Mesmo erro nos dois casos (usuário inexistente / senha errada).
    // bcrypt.compare re-hasheia a senha com o salt embutido no hash guardado
    // e compara — nunca "descriptografa" nada.
    if (!found || !(await bcrypt.compare(password, found.passwordHash))) {
      throw new InvalidCredentialsError();
    }

    const payload: TokenPayload = { sub: found.id, email: found.email };
    const token = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });

    // Devolve o user SEM o hash: destructuring descarta passwordHash
    const { passwordHash: _discard, ...user } = found;
    return { token, user };
  },

  verifyToken(token: string): TokenPayload {
    // jwt.verify JOGA se a assinatura não bate ou se expirou.
    // Quem traduz isso em 401 é o middleware da próxima etapa.
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  },
};
