describe('Parent — open vaccination entry', () => {
  beforeEach(() => {
    cy.loginAs('parent');
  });

  it('renders the vaccinations records page', () => {
    cy.visit('/dashboard/records/vaccinations');
    cy.url().should('include', '/dashboard/records/vaccinations');
    cy.contains(/Vaccination/i).should('be.visible');
  });

  it('opens a vaccination-entry form via the add control', () => {
    cy.visit('/dashboard/records/vaccinations');
    cy.contains('button', /Add|Log|Record/i)
      .first()
      .click({ force: true });
    cy.contains(/Vaccine|Date Administered|Batch|Manufacturer/i, { timeout: 5_000 }).should('exist');
  });
});
