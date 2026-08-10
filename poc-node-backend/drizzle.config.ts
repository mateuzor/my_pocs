import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

// Aula 12 — Config do drizzle-kit
// - schema aponta pro schema TS (source of truth)
// - out é onde vão os arquivos SQL gerados
// - dialect diz qual SQL dialeto emitir (sqlite / pg / mysql)
// dbCredentials.url só é necessário pro `drizzle-kit studio` (UI local)

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? './data/tasks.db',
  },
  verbose: true,
  strict: true,
});
