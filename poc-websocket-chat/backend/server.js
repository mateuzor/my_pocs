
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 4000 });
let clientId = 0;

wss.on('connection', function connection(ws) {
  ws.id = ++clientId;
  console.log(`Cliente ${ws.id} conectado`);

  ws.send(JSON.stringify({ system: true, message: 'Você entrou no chat!' }));

  ws.on('message', function incoming(data) {
    const msg = data.toString();

    // Envia para todos os clientes com identificação de quem enviou
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        const sender = client === ws ? 'Você' : `Usuário ${ws.id}`;
        client.send(JSON.stringify({ sender, message: msg }));
      }
    });
  });
});
