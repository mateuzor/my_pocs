import { db } from '../db/connection.js';

// Aula 8 — Repositório de usuários
//
// Mesmo padrão da aula 6: SQL mora aqui e só aqui.
//
// Detalhe de segurança que vale reparar: existem DOIS tipos de retorno.
//   - `User`      → nunca carrega o hash. É o que sai pela API.
//   - `UserRow`   → tem passwordHash. Só circula dentro do repo/service.
// Separar os tipos faz o TypeScript impedir que o hash vaze numa response
// por descuido. Segurança que o compilador cobra, não a revisão de código.

export interface User {
  id: number;
  email: string;
  createdAt: string;
}

export interface UserWithPassword extends User {
  passwordHash: string;
}

interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  created_at: string;
}

function rowToUser(row: UserRow): User {
  return { id: row.id, email: row.email, createdAt: row.created_at };
}

function rowToUserWithPassword(row: UserRow): UserWithPassword {
  return { ...rowToUser(row), passwordHash: row.password_hash };
}

const statements = {
  findByEmail: db.prepare('SELECT * FROM users WHERE email = ?'),
  findById: db.prepare('SELECT * FROM users WHERE id = ?'),
  insert: db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)'),
};

export const usersRepository = {
  // Só esta função devolve o hash — é a que o login precisa
  findByEmailWithPassword(email: string): UserWithPassword | null {
    const row = statements.findByEmail.get(email) as UserRow | undefined;
    return row ? rowToUserWithPassword(row) : null;
  },

  findById(id: number): User | null {
    const row = statements.findById.get(id) as UserRow | undefined;
    return row ? rowToUser(row) : null;
  },

  insert(email: string, passwordHash: string): User {
    const result = statements.insert.run(email, passwordHash);
    return this.findById(Number(result.lastInsertRowid))!;
  },
};
