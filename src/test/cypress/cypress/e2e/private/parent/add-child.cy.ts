describe('Parent — open Add Child form', () => {
  beforeEach(() => {
    cy.loginAs('parent');
  });

  it('navigates to the new-child page from the dashboard quick action', () => {
    cy.contains('a', /Add New Child/i).first().click();
    cy.url().should('include', '/dashboard/children/new');
  });

  it('renders the core child profile fields', () => {
    cy.visit('/dashboard/children/new');
    cy.get('input[name="firstName"], input[placeholder*="First" i]').should('exist');
    cy.get('input[name="lastName"], input[placeholder*="Last" i]').should('exist');
    cy.get('input[type="date"], input[name="dateOfBirth"], input[placeholder*="Birth" i]').should(
      'exist',
    );
  });

  it('rejects an empty submit with at least one validation message', () => {
    cy.visit('/dashboard/children/new');
    cy.contains('button', /Save|Create|Add/i).click({ force: true });
    cy.contains(/required|please|enter/i, { timeout: 5_000 }).should('exist');
  });
});
