import bcrypt from 'bcryptjs';
import { usersRepository, type User } from '../repositories/users.repository.js';
import { AppError } from '../errors.js';

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
};
