// https://docs.cypress.io/api/introduction/api.html

describe('My First Test', () => {
  it('Visits the Home Page', () => {
    cy.visit('/')
    cy.contains('h1', 'AWESOME NAIL!')
  })
})

