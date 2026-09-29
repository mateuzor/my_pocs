import path from 'node:path';
import { describe, it, expect } from 'vitest';
import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import { UserClient } from '../src/userClient';

const { integer, string, regex } = MatchersV3;

// The consumer test DEFINES the contract: it states which requests we make
// and the minimum response shape we rely on. Running it writes pacts/*.json.
const provider = new PactV3({
  consumer: 'WebApp',
  provider: 'UserService',
  dir: path.resolve(process.cwd(), 'pacts'),
});

describe('UserClient contract', () => {
  it('fetches an existing user', async () => {
    provider
      .given('user 1 exists') // provider state: how the provider must be set up
      .uponReceiving('a request for user 1')
      .withRequest({ method: 'GET', path: '/users/1', headers: { Accept: 'application/json' } })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        // Matchers assert TYPE, not exact values, so the contract does not
        // break when the provider changes irrelevant data.
        body: {
          id: integer(1),
          name: string('Ada Lovelace'),
          email: regex(/^[^@]+@[^@]+$/, 'ada@example.com'),
        },
      });

    // Pact spins up a mock provider; our real client talks to it over HTTP.
    await provider.executeTest(async (mock) => {
      const user = await new UserClient(mock.url).getUser(1);
      expect(user.id).toBe(1);
    });
  });

  it('handles a missing user', async () => {
    provider
      .given('user 999 does not exist')
      .uponReceiving('a request for user 999')
      .withRequest({ method: 'GET', path: '/users/999', headers: { Accept: 'application/json' } })
      .willRespondWith({ status: 404 });

    await provider.executeTest(async (mock) => {
      await expect(new UserClient(mock.url).getUser(999)).rejects.toThrow('User not found');
    });
  });
});
