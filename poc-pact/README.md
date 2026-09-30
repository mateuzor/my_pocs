# poc-pact

## What
Consumer-driven contract testing with Pact JS. A `WebApp` consumer (`UserClient`) defines what it needs from `UserService`; Pact records that as a JSON contract; a small Express provider is then verified against it.

## Why
Integration tests against a full environment are slow and flaky, and mocks drift from reality. A contract test checks each side in isolation against a shared, versioned agreement. If the provider changes something a consumer relies on, provider CI fails before deploy.

## How to run
```bash
npm install
npm run test:consumer   # generates pacts/WebApp-UserService.json
npm run test:provider   # verifies the Express provider against that pact
npm run start:provider  # optional: run the provider manually
```

## Workflow
1. Consumer writes a test with the mock provider; it generates the pact file.
2. The pact is published (to a Pact Broker or PactFlow in real setups; a local file here).
3. Provider CI fetches pacts and verifies them, using provider states to prepare data.
4. `can-i-deploy` checks the verification matrix before releasing either side.

## What to tell a mentor
- The consumer drives the contract: it only specifies what it actually uses.
- Use matchers (type, regex) instead of exact values to keep contracts loose.
- Provider states keep tests independent from real data.
- Contracts test the interface, not business logic; they complement, not replace, E2E tests.
- Run the consumer test before the provider test, since the provider reads the generated file.
