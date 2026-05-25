describe('Signup — public form', () => {
  it('renders the signup page', () => {
    cy.visit('/signup');
    cy.contains(/Sign\s*up|Create.*account/i, { timeout: 10_000 }).should('be.visible');
  });

  it('shows the core identity inputs', () => {
    cy.visit('/signup');
    cy.get('input[type="email"], input[name="email"], input[placeholder*="Email" i]').should(
      'exist',
    );
    cy.get('input[type="password"], input[name="password"], input[placeholder*="Password" i]').should(
      'exist',
    );
  });

  it('surfaces a validation message when submitted empty', () => {
    cy.visit('/signup');
    cy.contains('button', /Sign\s*up|Create/i).click({ force: true });
    cy.contains(/required|please|enter|invalid/i, { timeout: 5_000 }).should('exist');
  });
});
