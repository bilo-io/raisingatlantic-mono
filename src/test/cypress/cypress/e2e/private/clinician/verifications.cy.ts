describe('Clinician — verifications hub', () => {
  beforeEach(() => {
    cy.loginAs('clinician');
  });

  it('exposes a verifications entry point in the clinician sidebar', () => {
    cy.get('.bg-sidebar').first().within(() => {
      cy.contains(/Verifications/i).should('be.visible');
    });
  });

  it('navigates to the verifications page', () => {
    cy.get('.bg-sidebar').first().contains(/Verifications/i).click();
    cy.url().should('include', '/dashboard/verifications');
  });

  it('shows the page heading and a list/empty-state', () => {
    cy.visit('/dashboard/verifications');
    cy.contains(/Verifications|Pending Assessment|No items/i, { timeout: 10_000 }).should(
      'be.visible',
    );
  });
});
