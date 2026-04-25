describe('Test login page — role-based UI flow', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    // Ensure no prior session so the app doesn't auto-redirect us away.
    cy.visit('/login/test', {
      onBeforeLoad(win) {
        win.localStorage.removeItem('currentUserId');
        win.localStorage.removeItem('mock_auth_current_user_id');
      },
    });
    cy.contains('Login').should('be.visible');
  });

  const cases: Array<{
    role: string;
    roleOptionLabel: RegExp;
    userName: string;
    welcome: RegExp;
  }> = [
    {
      role: 'parent',
      roleOptionLabel: /^Parent$/,
      userName: 'Jane Doe',
      welcome: /Welcome back,\s*Jane Doe/i,
    },
    {
      role: 'clinician',
      roleOptionLabel: /^Clinician$/,
      userName: 'John Smith',
      welcome: /Welcome back,.*John Smith/i,
    },
    {
      role: 'admin',
      roleOptionLabel: /^Admin$/,
      userName: 'Admin User',
      welcome: /Administrator Dashboard/i,
    },
  ];

  cases.forEach(({ role, roleOptionLabel, userName, welcome }) => {
    it(`logs in as ${role} via the /login/test dropdowns`, () => {
      // Role dropdown (first combobox).
      cy.get('[role="combobox"]').eq(0).click();
      cy.get('[role="option"]').contains(roleOptionLabel).click();

      // User dropdown (second combobox, enabled once role is picked).
      cy.get('[role="combobox"]').eq(1).click();
      cy.get('[role="option"]').contains(userName).click();

      cy.contains('button', new RegExp(`Login as ${userName}`)).click();

      cy.url({ timeout: 15_000 }).should('include', '/dashboard');
      cy.contains(welcome, { timeout: 20_000 }).should('be.visible');
    });
  });
});
