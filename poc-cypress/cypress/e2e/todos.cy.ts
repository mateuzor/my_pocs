// Cypress E2E tests run in a real browser against a running dev server.
// Key differences from Jest/RTL:
//   - Tests RUN IN THE BROWSER, not Node. The app under test is the actual app.
//   - Async by default — cy.get() retries until the element exists (configurable timeout).
//   - You see EVERY step in the runner UI with DOM snapshots, easy to debug.
//   - Network requests are mockable with cy.intercept().
//
// Selectors: prefer data-cy attributes over CSS classes or text content.
// They're stable across styling and copy changes.

describe('Todos', () => {
  beforeEach(() => {
    // baseUrl is configured in cypress.config.ts — cy.visit('/') goes to localhost:5173
    cy.visit('/');
  });

  it('adds a new todo', () => {
    cy.get('[data-cy=todo-input]').type('Buy groceries');
    cy.get('[data-cy=todo-add]').click();

    cy.get('[data-cy=todo-list]')
      .find('[data-cy=todo-item]')
      .should('have.length', 1)
      .first()
      .within(() => {
        cy.get('[data-cy=todo-text]').should('contain.text', 'Buy groceries');
        cy.get('[data-cy=todo-toggle]').should('not.be.checked');
      });
  });

  it('adds a todo by pressing Enter', () => {
    cy.get('[data-cy=todo-input]').type('Submit invoices{enter}');
    cy.get('[data-cy=todo-item]').should('have.length', 1);
    cy.get('[data-cy=todo-input]').should('have.value', ''); // input cleared
  });

  it('toggles a todo as done', () => {
    cy.get('[data-cy=todo-input]').type('Read a book{enter}');
    cy.get('[data-cy=todo-toggle]').check();

    cy.get('[data-cy=todo-item]').should('have.attr', 'data-done', 'true');
    cy.get('[data-cy=todo-text]').should('have.css', 'text-decoration-line', 'line-through');
  });

  it('removes a todo', () => {
    cy.get('[data-cy=todo-input]').type('Item 1{enter}');
    cy.get('[data-cy=todo-input]').type('Item 2{enter}');
    cy.get('[data-cy=todo-item]').should('have.length', 2);

    cy.get('[data-cy=todo-item]').first().find('[data-cy=todo-remove]').click();
    cy.get('[data-cy=todo-item]').should('have.length', 1);
    cy.get('[data-cy=todo-text]').should('contain.text', 'Item 2');
  });
});

describe('Fetch user', () => {
  it('shows the user card after a successful fetch', () => {
    // cy.intercept() stubs a network request before it happens.
    // This makes the test deterministic — no real API call.
    cy.intercept('GET', '**/users/1', {
      statusCode: 200,
      body: { id: 1, name: 'Test User', email: 'test@example.com' },
    }).as('getUser'); // alias for later wait

    cy.visit('/');
    cy.get('[data-cy=fetch-user]').click();

    // cy.wait('@getUser') pauses the test until the intercepted request resolves
    cy.wait('@getUser');
    cy.get('[data-cy=user-card]').should('contain.text', 'Test User');
    cy.get('[data-cy=user-card]').should('contain.text', 'test@example.com');
  });

  it('handles an API error gracefully', () => {
    // Same intercept pattern, but returning a 500 — the UI should not crash
    cy.intercept('GET', '**/users/1', { statusCode: 500 }).as('getUser');

    cy.visit('/');
    cy.get('[data-cy=fetch-user]').click();
    cy.wait('@getUser');

    // The card should NOT appear when the fetch fails
    cy.get('[data-cy=user-card]').should('not.exist');
    // The button should be re-enabled (not stuck in loading state)
    cy.get('[data-cy=fetch-user]').should('not.be.disabled');
  });
});
