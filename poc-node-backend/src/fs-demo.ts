import { readFile, writeFile, stat, mkdir } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { join, dirname, basename, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeline } from 'node:stream/promises';

// Aula 2 — Módulos nativos: fs, path, streams
//
// Este arquivo é um "laboratório" — pode ser rodado sozinho com
// `npx tsx src/fs-demo.ts` pra testar cada função. Não é parte do servidor.

// Em ESM, __dirname não existe — recria com import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// -------------------------------------------------------------------
// PATH — manipulação de caminhos (multi-plataforma: usa / no Unix, \ no Windows)
// -------------------------------------------------------------------
console.log('--- path ---');
console.log('__dirname:', __dirname);
console.log('join:', join(__dirname, '..', 'data', 'big-file.txt'));
console.log('resolve:', resolve('data', 'big-file.txt'));
console.log('basename:', basename('/tmp/foo/bar.txt'));    // 'bar.txt'
console.log('extname:', extname('script.min.js'));          // '.js'

// -------------------------------------------------------------------
// FS/promises — leitura e escrita async com await
// -------------------------------------------------------------------
async function fsDemo() {
  const filePath = join(__dirname, '..', 'data', 'big-file.txt');

  console.log('\n--- fs/promises ---');

  // Ler arquivo inteiro na memória — bom pra arquivos pequenos
  const content = await readFile(filePath, 'utf-8');
  console.log(`readFile: ${content.length} caracteres`);

  // stat = metadados (tamanho, mtime, tipo)
  const info = await stat(filePath);
  console.log(`size: ${info.size} bytes, mtime: ${info.mtime.toISOString()}`);

  // Criar pasta (recursive: true = mkdir -p, não falha se já existe)
  const tmpDir = join(__dirname, '..', 'data', 'tmp');
  await mkdir(tmpDir, { recursive: true });

  // Escrever arquivo
  const outPath = join(tmpDir, 'echo.txt');
  await writeFile(outPath, `Escrito em ${new Date().toISOString()}\n${content}`);
  console.log(`writeFile: ${outPath} criado`);
}

// -------------------------------------------------------------------
// STREAMS — processar dados em CHUNKS, sem carregar tudo na memória
// -------------------------------------------------------------------
async function streamsDemo() {
  const filePath = join(__dirname, '..', 'data', 'big-file.txt');

  console.log('\n--- streams ---');

  // createReadStream retorna um Readable stream — emite eventos 'data'
  // e 'end'. Para arquivos gigantes (GB+), esta é a única forma viável.
  const stream = createReadStream(filePath, { encoding: 'utf-8', highWaterMark: 64 });

  let chunkCount = 0;
  let totalBytes = 0;

  // O padrão event-emitter clássico
  stream.on('data', (chunk) => {
    chunkCount++;
    totalBytes += chunk.length;
    console.log(`chunk #${chunkCount} (${chunk.length} bytes)`);
  });

  // Convertendo o stream em Promise pra usar await no fim
  await new Promise<void>((resolve, reject) => {
    stream.on('end', () => resolve());
    stream.on('error', reject);
  });

  console.log(`total: ${chunkCount} chunks, ${totalBytes} bytes`);
}

// -------------------------------------------------------------------
// PIPELINE — a forma moderna de encadear streams com tratamento de erro
// -------------------------------------------------------------------
async function pipelineDemo() {
  const src = join(__dirname, '..', 'data', 'big-file.txt');
  const dest = join(__dirname, '..', 'data', 'tmp', 'copy.txt');

  await mkdir(dirname(dest), { recursive: true });

  console.log('\n--- pipeline ---');

  // pipeline() do stream/promises = pipe() + tratamento de erros
  // + await no final. Substitui o padrão antigo readStream.pipe(writeStream).
  const { createWriteStream } = await import('node:fs');
  await pipeline(
    createReadStream(src),
    createWriteStream(dest)
  );

  console.log(`copiado: ${src} → ${dest}`);
}

// Rodar tudo em sequência
await fsDemo();
await streamsDemo();
await pipelineDemo();
