import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 4000 });
let clientId = 0;

wss.on("connection", function connection(ws) {
  ws.id = ++clientId;
  console.log(`Client ${ws.id} connected`);

  ws.send(JSON.stringify({ system: true, message: "You joined the chat!" }));

  ws.on("message", function incoming(data) {
    const msg = data.toString();

    // Broadcast to all clients with sender identification
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        const sender = client === ws ? "You" : `User ${ws.id}`;
        client.send(JSON.stringify({ sender, message: msg }));
      }
    });
  });
});
