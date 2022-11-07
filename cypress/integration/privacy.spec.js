Cypress._.times(5, function() {
  it.only('Testa a página da política de privavidade de forma independente', function () {
    cy.visit('./src/privacy.html')
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT - Política de privacidade')
    cy.get('#title').should('have.text', 'CAC TAT - Política de privacidade')
    cy.get('body').contains('Talking About Test').should('be.visible')
  })
});