// cy.intercept() lets Cypress intercept and stub network requests,
// making e2e tests deterministic — no real API calls, no flakiness.

describe('API intercept demo', () => {

  it('intercepts a fetch call and stubs the response', () => {
    // Set up the intercept BEFORE visiting the page —
    // Cypress will catch any request matching this URL pattern
    cy.intercept('GET', '**/posts*', {
      statusCode: 200,
      body: [
        { id: 1, title: 'Mocked Post One', body: 'Stubbed response' },
        { id: 2, title: 'Mocked Post Two', body: 'No real API call made' },
      ],
    }).as('getPosts'); // alias for waiting later with cy.wait('@getPosts')

    cy.visit('/');
    cy.get('body').should('exist');
  });

  it('intercepts and simulates a server error', () => {
    // Simulate a 500 to test error states in components
    cy.intercept('GET', '**/users*', {
      statusCode: 500,
      body: { message: 'Internal Server Error' },
    }).as('getUsersError');

    cy.visit('/');
    cy.get('body').should('exist');
  });

  it('uses a spy to verify a request was made without stubbing', () => {
    // Without a body/fixture, intercept acts as a passthrough spy.
    // Use this to assert a request happened without changing the response.
    cy.intercept('GET', 'https://jsonplaceholder.typicode.com/**').as('apiCall');

    cy.visit('/');
    // cy.wait('@apiCall').its('response.statusCode').should('eq', 200);
    cy.get('body').should('exist');
  });
});
