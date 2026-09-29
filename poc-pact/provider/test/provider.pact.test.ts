import path from 'node:path';
import type { AddressInfo } from 'node:net';
import { describe, it, beforeAll, afterAll } from 'vitest';
import { Verifier } from '@pact-foundation/pact';
import { createApp, db } from '../src/app';

describe('UserService provider verification', () => {
  let server: ReturnType<ReturnType<typeof createApp>['listen']>;
  let port: number;

  beforeAll(async () => {
    server = createApp().listen(0);
    port = (server.address() as AddressInfo).port;
  });
  afterAll(() => {
    server.close();
  });

  it('honours the contracts published by consumers', async () => {
    // The Verifier REPLAYS every recorded request against the real provider
    // and compares the responses with what consumers expect.
    await new Verifier({
      provider: 'UserService',
      providerBaseUrl: `http://localhost:${port}`,
      pactUrls: [path.resolve(process.cwd(), 'pacts', 'WebApp-UserService.json')],
      // State handlers put the provider in the state each interaction needs.
      stateHandlers: {
        'user 1 exists': async () => {
          db.clear();
          db.set(1, { id: 1, name: 'Ada Lovelace', email: 'ada@example.com' });
        },
        'user 999 does not exist': async () => {
          db.clear();
        },
      },
    }).verifyProvider();
  });
});
