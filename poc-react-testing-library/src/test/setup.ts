// WHY: adds DOM matchers like toBeInTheDocument / toHaveValue / toBeDisabled.
import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './server';

// WHY: msw intercepts at the network layer, so the component's real fetch code runs untouched.
// "error" makes any unmocked request fail the test instead of silently hitting the internet.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
// Per-test overrides (server.use) must not leak into the next test.
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
