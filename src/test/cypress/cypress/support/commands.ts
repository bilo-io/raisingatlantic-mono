/// <reference types="cypress" />

export type TestRole = 'parent' | 'clinician' | 'admin' | 'super_admin';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Log in via the /login/test UI (role + user dropdowns) as the first user
       * matching the given role, then wait for the dashboard welcome heading.
       * Uses the UI flow so it works whether the app is in mock or API mode.
       */
      loginAs(role: TestRole): Chainable<void>;
    }
  }
}

interface RoleMeta {
  optionLabel: RegExp;   // dropdown-visible label for the role
  userName: RegExp;      // dropdown-visible label of the test user
  welcome: RegExp;       // welcome text expected on the dashboard after login
}

const metaByRole: Record<TestRole, RoleMeta> = {
  parent: {
    optionLabel: /^Parent$/,
    userName: /Jane Doe/,
    welcome: /Welcome back,\s*Jane Doe/i,
  },
  clinician: {
    optionLabel: /^Clinician$/,
    userName: /John Smith/,
    welcome: /Welcome back,.*John Smith/i,
  },
  admin: {
    optionLabel: /^Admin$/,
    userName: /Admin User/,
    welcome: /Administrator Dashboard/i,
  },
  super_admin: {
    optionLabel: /^Super Admin$/,
    userName: /Super Admin/,
    welcome: /Super Administrator Dashboard/i,
  },
};

Cypress.Commands.add('loginAs', (role: TestRole) => {
  const meta = metaByRole[role];
  if (!meta) throw new Error(`Unknown test role "${role}"`);

  cy.viewport(1280, 720);
  cy.visit('/login/test', {
    onBeforeLoad(win) {
      // Make sure we don't start with a stale session.
      win.localStorage.removeItem('currentUserId');
      win.localStorage.removeItem('mock_auth_current_user_id');
    },
  });
  cy.contains('Login').should('be.visible');

  // Role dropdown (first combobox).
  cy.get('[role="combobox"]').eq(0).click();
  cy.get('[role="option"]').contains(meta.optionLabel).click();

  // User dropdown (second combobox, enabled after a role is picked).
  cy.get('[role="combobox"]').eq(1).click();
  cy.get('[role="option"]').contains(meta.userName).first().click();

  cy.contains('button', /Login as /i).click();

  cy.url({ timeout: 15_000 }).should('include', '/dashboard');
  cy.contains(meta.welcome, { timeout: 20_000 }).should('be.visible');
});

export {};
