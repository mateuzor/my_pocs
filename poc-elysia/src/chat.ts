import { Elysia, t } from 'elysia';

// WebSocket support is built into Elysia — no separate ws library needed.
// You attach a .ws() handler with the same lifecycle pattern as HTTP routes:
//   open    — when a client connects
//   message — when a client sends a frame
//   close   — when a client disconnects
//   error   — on socket error
//
// The same TypeBox validation applies to ws messages via the `body` schema —
// invalid frames are rejected before reaching your handler.

interface ChatMessage {
  user: string;
  text: string;
  ts: number;
}

// In-memory message history. A real impl would push to Redis or a DB.
const history: ChatMessage[] = [];

// Keep references to every connected socket so we can broadcast.
// In production you'd use Elysia's built-in `publish/subscribe` (rooms),
// but a Set is fine for a single-node demo.
const sockets = new Set<{ send: (msg: string) => void; id: string }>();

export const chatRoutes = new Elysia({ prefix: '/chat' })
  // GET — return the history so a new client can backfill before connecting
  .get('/history', () => history.slice(-50))

  // WS endpoint — open a connection to ws://localhost:3000/chat/ws
  .ws('/ws', {
    // Validates every incoming message frame. If the JSON doesn't match,
    // Elysia closes the connection with a protocol error.
    body: t.Object({
      user: t.String({ minLength: 1 }),
      text: t.String({ minLength: 1, maxLength: 500 }),
    }),

    // 1. open — fired once when the socket handshake completes
    open(ws) {
      const entry = { send: (msg: string) => ws.send(msg), id: ws.id };
      sockets.add(entry);
      // Send the recent history to the freshly connected client only
      ws.send(JSON.stringify({ type: 'history', messages: history.slice(-20) }));
      // Notify everyone else that a user joined
      broadcast({ type: 'system', text: `Client ${ws.id} joined` }, ws.id);
    },

    // 2. message — body is fully typed thanks to the schema above
    message(ws, body) {
      const msg: ChatMessage = { user: body.user, text: body.text, ts: Date.now() };
      history.push(msg);
      broadcast({ type: 'message', ...msg });
    },

    // 3. close — cleanup the socket from the broadcast set
    close(ws) {
      for (const s of sockets) if (s.id === ws.id) sockets.delete(s);
      broadcast({ type: 'system', text: `Client ${ws.id} left` });
    },
  });

// Helper: send a payload to all connected sockets, optionally excluding one
function broadcast(payload: unknown, excludeId?: string) {
  const serialized = JSON.stringify(payload);
  for (const s of sockets) {
    if (s.id !== excludeId) s.send(serialized);
  }
}
