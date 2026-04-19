describe('Health Check', () => {
  it('should load the homepage', () => {
    cy.visit('/');
    cy.get('body').should('exist');
    cy.contains('Raising Atlantic', { timeout: 15000 }).should('be.visible');
  });
});
