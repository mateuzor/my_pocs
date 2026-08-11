import multer from 'multer';
import { randomBytes } from 'node:crypto';
import { extname } from 'node:path';
import { mkdirSync } from 'node:fs';
import { AppError } from '../errors.js';

// Aula 13 — Upload com Multer.
//
// Multer é o middleware padrão do Express pra multipart/form-data.
// Duas coisas críticas de segurança a configurar:
//
// 1. LIMITE DE TAMANHO — sem isso, um cliente sobe um arquivo de 10GB e
//    trava o disco/RAM do servidor. `limits.fileSize` corta ANTES de escrever.
//
// 2. NOME DE ARQUIVO — nunca usar `file.originalname`. Ele vem do cliente e
//    pode conter `../../etc/passwd` (path traversal), ou colidir com outro
//    arquivo já lá. Geramos um nome aleatório e guardamos o original só como
//    METADADO no banco (pra exibir no UI).

const UPLOAD_DIR = './uploads';
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

// Whitelist de tipos aceitos. Preferir whitelist a blacklist:
// blacklist deixa passar o que você esqueceu (`.svg` com <script> embutido).
const ALLOWED_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
]);

mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    // 16 bytes de aleatoriedade + extensão do original (extname sanitiza).
    // Zero informação do cliente no path.
    const random = randomBytes(16).toString('hex');
    const ext = extname(file.originalname).toLowerCase().slice(0, 8);
    cb(null, `${random}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_SIZE,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIMES.has(file.mimetype)) {
      // Passar `false` = ignora silenciosamente. Passar um Error = joga.
      // Preferimos jogar pra virar 400 no error handler.
      cb(new AppError(`Tipo não permitido: ${file.mimetype}`, 415, 'UNSUPPORTED_MEDIA_TYPE'));
      return;
    }
    cb(null, true);
  },
});
