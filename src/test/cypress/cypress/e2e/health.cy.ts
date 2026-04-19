describe('Health Check', () => {
  it('should load the homepage', () => {
    cy.visit('/');
    cy.contains('Raising Atlantic', { timeout: 10000 }).should('be.visible');
  });
});
