import { createServer } from 'node:http';

// Tiny collector: accepts beacons and prints them. A real one would store
// them and aggregate p75 per metric, which is what Core Web Vitals use.
const server = createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/vitals') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      try {
        const m = JSON.parse(body);
        console.log(`[vitals] ${m.name} = ${Math.round(m.value)} (${m.rating})`, m.attribution ?? '');
      } catch {
        console.warn('[vitals] invalid payload');
      }
      res.writeHead(204).end();
    });
    return;
  }
  res.writeHead(404).end();
});

server.listen(4000, () => console.log('collector on http://localhost:4000/vitals'));
