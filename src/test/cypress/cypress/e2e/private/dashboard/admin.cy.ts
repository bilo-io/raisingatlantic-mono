describe('Admin dashboard — click-through', () => {
  beforeEach(() => {
    cy.loginAs('admin');
  });

  it('renders admin-only stat cards', () => {
    cy.contains('Total Clinicians').should('be.visible');
    cy.contains('Total Parents').should('be.visible');
    cy.contains('Total Children').should('be.visible');
    cy.contains('Pending Verifications').should('be.visible');
  });

  it('shows admin sidebar items and hides role-restricted items', () => {
    cy.get('.bg-sidebar').first().within(() => {
      cy.contains('Admin').should('be.visible');
      cy.contains('Patients').should('be.visible');
      cy.contains('Verifications').should('be.visible');
      cy.contains('Children').should('not.exist');
      cy.contains('Tenants').should('not.exist');
    });
  });

  it('loads the Admin hub page', () => {
    cy.visit('/dashboard/admin');
    cy.contains(/User Management/i).should('be.visible');
    cy.contains(/System Settings/i).should('be.visible');
  });

  it('loads and filters the user management table', () => {
    cy.visit('/dashboard/admin/users');
    cy.get('input[placeholder*="Search" i]', { timeout: 10_000 }).should('be.visible');
    cy.contains(/Add User/i).should('be.visible');
    // Type a harmless query — don't assert a specific row count (data-dependent).
    cy.get('input[placeholder*="Search" i]').first().type('jane');
    cy.get('input[placeholder*="Search" i]').first().should('have.value', 'jane');
  });

  it('loads the System Settings page', () => {
    cy.visit('/dashboard/admin/system');
    cy.url().should('include', '/dashboard/admin/system');
  });

  it('loads the Verifications hub', () => {
    cy.visit('/dashboard/verifications');
    cy.contains(/Verify Clinicians/i).should('be.visible');
    cy.contains(/Verify Records/i).should('be.visible');
  });

  it('navigates via "Manage Users" quick action', () => {
    cy.contains('a', /Manage Users/i).first().click();
    cy.url().should('include', '/dashboard/admin/users');
  });

  it('logs out via the user avatar dropdown', () => {
    cy.get('header').find('button[aria-haspopup="menu"]').last().click({ force: true });
    cy.contains('[role="menuitem"]', /Log out/i).click();
    cy.url({ timeout: 10_000 }).should('include', '/login');
  });
});
