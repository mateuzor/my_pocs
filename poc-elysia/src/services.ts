// Services that get injected into Elysia's context via .decorate()
// These are singletons — created once when the app starts and shared
// across every request handler. Typical examples: database clients,
// loggers, external API SDKs, config objects.

export class Logger {
  info(msg: string) {
    console.log(`[INFO]  ${new Date().toISOString()} ${msg}`);
  }
  warn(msg: string) {
    console.warn(`[WARN]  ${new Date().toISOString()} ${msg}`);
  }
  error(msg: string, err?: unknown) {
    console.error(`[ERROR] ${new Date().toISOString()} ${msg}`, err);
  }
}

// Fake "auth service" — in real life this would verify JWTs against a secret
// or check a session store. Here it just parses a header to extract a username.
export function parseAuthHeader(authorization?: string): { username: string } | null {
  if (!authorization) return null;
  // Expecting `Bearer <username>` for demo purposes
  const match = authorization.match(/^Bearer\s+(.+)$/);
  if (!match) return null;
  return { username: match[1] };
}
