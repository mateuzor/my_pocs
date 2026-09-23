import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

// Default "happy path" handlers; individual tests override them for error cases.
export const handlers = [
  http.get('/api/users', () =>
    HttpResponse.json([
      { id: 1, name: 'Ada Lovelace' },
      { id: 2, name: 'Alan Turing' },
    ]),
  ),
];

export const server = setupServer(...handlers);
