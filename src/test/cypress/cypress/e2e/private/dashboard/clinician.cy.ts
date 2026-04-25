describe('Clinician dashboard — click-through', () => {
  beforeEach(() => {
    cy.loginAs('clinician');
  });

  it('renders clinician-only stat cards', () => {
    cy.contains('My Patients').should('be.visible');
    cy.contains('Associated Parents').should('be.visible');
    cy.contains('Upcoming Vaccinations').should('be.visible');
    cy.contains('Pending Verifications').should('be.visible');
  });

  it('shows clinician sidebar items and hides other-role items', () => {
    cy.get('.bg-sidebar').first().within(() => {
      cy.contains('Patients').should('be.visible');
      cy.contains('Verifications').should('be.visible');
      cy.contains('Children').should('not.exist');
      cy.contains('Admin').should('not.exist');
      cy.contains('Tenants').should('not.exist');
    });
  });

  it('navigates to /dashboard/patients via sidebar', () => {
    cy.get('.bg-sidebar').first().contains('Patients').click();
    cy.url().should('include', '/dashboard/patients');
    cy.get('input[placeholder*="Search" i]', { timeout: 10_000 }).should('be.visible');
  });

  it('loads the Verifications hub and Clinicians sub-page', () => {
    cy.visit('/dashboard/verifications');
    cy.contains(/Verify Clinicians/i).should('be.visible');
    cy.contains(/Verify Records/i).should('be.visible');

    cy.visit('/dashboard/verifications/clinicians');
    cy.url().should('include', '/dashboard/verifications/clinicians');
    // Don't click Approve — that's a state-changing action.
  });

  it('loads the Records hub', () => {
    cy.visit('/dashboard/records');
    cy.contains(/Growth/i).should('be.visible');
    cy.contains(/Milestones/i).should('be.visible');
    cy.contains(/Vaccinations/i).should('be.visible');
  });

  it('navigates via "View Patient List" quick action', () => {
    cy.contains('a', /View Patient List/i).first().click();
    cy.url().should('include', '/dashboard/patients');
  });

  it('logs out via the user avatar dropdown', () => {
    cy.get('header').find('button[aria-haspopup="menu"]').last().click({ force: true });
    cy.contains('[role="menuitem"]', /Log out/i).click();
    cy.url({ timeout: 10_000 }).should('include', '/login');
  });
});
