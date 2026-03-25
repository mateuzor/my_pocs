// Custom Cypress commands extend cy.* — useful for repeated patterns like login.
// Example: cy.login('user@example.com', 'password')
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//     }
//   }
// }
//
// Cypress.Commands.add('login', (email, password) => {
//   cy.visit('/login')
//   cy.get('[data-cy=email]').type(email)
//   cy.get('[data-cy=password]').type(password)
//   cy.get('[data-cy=submit]').click()
// })
