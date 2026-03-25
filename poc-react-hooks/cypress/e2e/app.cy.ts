// Cypress tests describe full user journeys through a real browser.
// Unlike unit tests, they exercise the whole stack — routing, rendering, user events.

describe('App smoke tests', () => {

  beforeEach(() => {
    // cy.visit navigates the browser to the URL — baseUrl is prepended automatically
    cy.visit('/');
  });

  it('loads the page without errors', () => {
    // cy.get() queries the DOM and waits automatically until the element exists
    cy.get('body').should('exist');
    cy.get('h1, h2, h3').first().should('be.visible');
  });

  it('has a visible title on the page', () => {
    // should() chains assertions and retries until they pass or timeout
    cy.get('h1, h2').first().should('be.visible').and('not.be.empty');
  });

  it('can interact with a button', () => {
    cy.get('button').first().should('be.visible').click();
  });
});

describe('Counter interactions', () => {

  beforeEach(() => {
    cy.visit('/');
  });

  it('finds a counter section', () => {
    // contains() searches for text content anywhere in the DOM
    cy.contains(/counter/i).should('exist');
  });
});
