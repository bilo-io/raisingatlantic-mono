describe('Parent dashboard — click-through', () => {
  beforeEach(() => {
    cy.loginAs('parent');
  });

  it('renders parent-only stat cards', () => {
    cy.contains('My Children').should('be.visible');
    cy.contains('My Clinicians').should('be.visible');
    cy.contains('Upcoming Vaccinations').should('be.visible');
    cy.contains('Growth & Milestones Due').should('be.visible');
  });

  it('shows parent-only sidebar and hides other-role items', () => {
    cy.get('.bg-sidebar').first().within(() => {
      cy.contains('Children').should('be.visible');
      cy.contains('Admin').should('not.exist');
      cy.contains('Tenants').should('not.exist');
      cy.contains('Verifications').should('not.exist');
      cy.contains('Patients').should('not.exist');
    });
  });

  it('navigates to /dashboard/children via sidebar', () => {
    cy.get('.bg-sidebar').first().contains('Children').click();
    cy.url().should('include', '/dashboard/children');
  });

  it('navigates through Records hub and its sub-pages', () => {
    cy.visit('/dashboard/records');
    cy.contains(/Growth/i).should('be.visible');
    cy.contains(/Milestones/i).should('be.visible');
    cy.contains(/Vaccinations/i).should('be.visible');

    cy.visit('/dashboard/records/growth');
    cy.url().should('include', '/dashboard/records/growth');
  });

  it('loads the clinicians directory page', () => {
    cy.visit('/dashboard/directory/clinicians');
    cy.url().should('include', '/dashboard/directory/clinicians');
    cy.get('input[placeholder*="Search" i]', { timeout: 10_000 }).should('be.visible');
  });

  it('loads the account hub page with profile and settings cards', () => {
    cy.visit('/dashboard/account');
    cy.contains(/Profile/i).should('be.visible');
    cy.contains(/Settings/i).should('be.visible');
  });

  it('opens "Add New Child" via quick action (without submitting)', () => {
    cy.contains('a', /Add New Child/i).first().click();
    cy.url().should('include', '/dashboard/children/new');
  });

  it('navigates to Profile via the user avatar dropdown', () => {
    cy.get('header').find('button[aria-haspopup="menu"]').last().click({ force: true });
    cy.contains('[role="menuitem"]', /^Profile$/).click();
    cy.url().should('include', '/dashboard/account/profile');
  });

  it('logs out via the user avatar dropdown', () => {
    cy.get('header').find('button[aria-haspopup="menu"]').last().click({ force: true });
    cy.contains('[role="menuitem"]', /Log out/i).click();
    cy.url({ timeout: 10_000 }).should('include', '/login');
  });
});
