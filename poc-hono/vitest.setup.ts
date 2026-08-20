import { webcrypto } from 'node:crypto';

if (!globalThis.crypto) {
  globalThis.crypto = webcrypto as unknown as Crypto;
}
// `hono/jwt` also checks `instanceof CryptoKey` when signing/verifying,
// so the class itself needs to be global too, not just `crypto.subtle`.
if (!globalThis.CryptoKey) {
  globalThis.CryptoKey = (webcrypto as unknown as { CryptoKey: typeof CryptoKey }).CryptoKey;
}
