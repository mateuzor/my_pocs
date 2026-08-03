import { defineConfig } from 'vitest/config';

// Aula 7 — Configuração de testes
//
// Dois detalhes que fazem a diferença aqui:
//
// 1. `env` é aplicado ANTES de qualquer módulo ser importado. Isso importa
//    porque src/env.ts e src/db/connection.ts leem process.env no topo do
//    arquivo (na importação, não em runtime). Se setássemos DATABASE_URL
//    depois, a conexão já teria aberto o banco de produção.
//
// 2. `:memory:` é um banco SQLite que vive só na RAM. Cada rodada de teste
//    começa limpa e nada toca ./data/tasks.db.

export default defineConfig({
  test: {
    environment: 'node',
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: ':memory:',
    },
    setupFiles: ['./src/test/setup.ts'],
  },
});
