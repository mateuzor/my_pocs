import { createHash, randomBytes } from 'node:crypto';
import { db } from '../db/connection.js';

// Aula 11 — Refresh tokens
//
// PADRÃO DE SEGURANÇA: guardamos o HASH do token, não o token em texto.
// Se um atacante vazar o banco, os hashes não podem ser reusados como
// tokens — mesma lógica de bcrypt pra senha, só que aqui SHA-256 basta
// porque o token JÁ é aleatório (não precisa "engrossar" um segredo fraco).

// Gera 48 bytes aleatórios (~64 chars em base64url). Isso é o que vai pro
// cliente. O que fica no banco é o hash disso.
export function generateRefreshToken(): string {
  return randomBytes(48).toString('base64url');
}

function hash(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

interface RefreshTokenRow {
  id: number;
  user_id: number;
  token_hash: string;
  expires_at: string;
  revoked_at: string | null;
  created_at: string;
}

const statements = {
  insert: db.prepare(
    'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)'
  ),
  findByHash: db.prepare('SELECT * FROM refresh_tokens WHERE token_hash = ?'),
  revoke: db.prepare("UPDATE refresh_tokens SET revoked_at = datetime('now') WHERE id = ?"),
  revokeAllByUser: db.prepare(
    "UPDATE refresh_tokens SET revoked_at = datetime('now') WHERE user_id = ? AND revoked_at IS NULL"
  ),
};

export const refreshTokensRepository = {
  // Guarda o token novo. `expiresAt` é ISO string.
  store(userId: number, token: string, expiresAt: Date): void {
    statements.insert.run(userId, hash(token), expiresAt.toISOString());
  },

  // Retorna { id, userId } se o token existe, não expirou e não foi revogado.
  // null caso contrário — assim o service dá um erro genérico sem revelar qual condição.
  findActive(token: string): { id: number; userId: number } | null {
    const row = statements.findByHash.get(hash(token)) as RefreshTokenRow | undefined;
    if (!row) return null;
    if (row.revoked_at !== null) return null;
    if (new Date(row.expires_at) <= new Date()) return null;
    return { id: row.id, userId: row.user_id };
  },

  // Marca UM token como revogado (rotação: usou refresh → gera novo → revoga o antigo).
  revoke(id: number): void {
    statements.revoke.run(id);
  },

  // Logout global — revoga TODOS os refresh tokens vivos do usuário.
  // O access token curto ainda vale até expirar, mas nenhum novo pode ser emitido.
  revokeAllForUser(userId: number): void {
    statements.revokeAllByUser.run(userId);
  },
};
