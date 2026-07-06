import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { createReadStream, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Aula 1 — HTTP nativo do Node
//
// Antes de usar Express (ou qualquer framework), preciso entender o que
// o Node oferece de fábrica. O módulo `http` expõe:
//   - createServer(handler)  → cria o servidor
//   - IncomingMessage        → objeto do request (herda de stream.Readable)
//   - ServerResponse         → objeto do response (herda de stream.Writable)
//
// Nada de "middleware", "roteador", "body parser". Um handler puro que recebe
// (req, res) e é responsável por tudo — inclusive parsear body, tratar métodos
// HTTP, definir status code e headers na mão.

const PORT = 3000;

function handler(req: IncomingMessage, res: ServerResponse) {
  const { method, url } = req;

  // Roteamento manual — analisando url + método na unha
  if (method === 'GET' && url === '/') {
    res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Olá do servidor HTTP nativo do Node!');
    return;
  }

  if (method === 'GET' && url === '/info') {
    res.writeHead(200, { 'content-type': 'application/json' });
    // JSON precisa ser stringificado à mão — não tem res.json()
    res.end(
      JSON.stringify({
        node: process.version,
        platform: process.platform,
        uptimeSec: Math.floor(process.uptime()),
      })
    );
    return;
  }

  if (method === 'POST' && url === '/echo') {
    // Body é um STREAM — precisa juntar os chunks manualmente.
    // Isso é o que o body-parser do Express faz por baixo.
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => {
      const body = Buffer.concat(chunks).toString('utf-8');
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ received: body, length: body.length }));
    });
    return;
  }

  // Aula 2 — STREAMING de arquivo direto pro response
  // pipe() conecta um Readable ao Writable — nenhum byte fica em memória
  // além do highWaterMark de cada chunk. Essencial pra arquivos grandes.
  if (method === 'GET' && url === '/download') {
    const filePath = join(__dirname, '..', 'data', 'big-file.txt');
    if (!existsSync(filePath)) {
      res.writeHead(404).end('Arquivo não encontrado');
      return;
    }
    res.writeHead(200, {
      'content-type': 'text/plain; charset=utf-8',
      'content-disposition': 'attachment; filename="big-file.txt"',
    });
    // O res HERDA de stream.Writable — dá pra pipear direto
    createReadStream(filePath).pipe(res);
    return;
  }

  // 404 padrão
  res.writeHead(404, { 'content-type': 'text/plain' });
  res.end('Rota não encontrada');
}

const server = createServer(handler);

server.listen(PORT, () => {
  console.log(`Servidor HTTP nativo rodando em http://localhost:${PORT}`);
  console.log('Rotas:');
  console.log(`  GET  /       → hello world`);
  console.log(`  GET  /info   → info do processo`);
  console.log(`  POST /echo     → devolve o body recebido`);
  console.log(`  GET  /download → stream de arquivo (createReadStream + pipe)`);
});
