describe('Parent — open growth-record entry', () => {
  beforeEach(() => {
    cy.loginAs('parent');
  });

  it('shows the Growth section on the records hub', () => {
    cy.visit('/dashboard/records');
    cy.contains(/Growth/i).should('be.visible');
  });

  it('renders the dedicated growth records page', () => {
    cy.visit('/dashboard/records/growth');
    cy.url().should('include', '/dashboard/records/growth');
    cy.contains(/Growth/i).should('be.visible');
  });

  it('opens a growth-entry form when the add button is clicked', () => {
    cy.visit('/dashboard/records/growth');
    cy.contains('button', /Add|Log|Record/i)
      .first()
      .click({ force: true });
    // Modal heading or weight/height field should appear
    cy.contains(/Weight|Height|Growth Record/i, { timeout: 5_000 }).should('exist');
  });
});
