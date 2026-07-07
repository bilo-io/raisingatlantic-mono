import { auditA11y } from '../../support/a11y';
import type { TestRole } from '../../support/commands';

// Automated accessibility audit of the authenticated dashboards (DEV.md §12.2).
// The manual keyboard-nav + screen-reader pass on these screens is still
// outstanding — see PHASE_12_TODO.md.
describe('Dashboards — accessibility (axe-core)', () => {
  const roles: TestRole[] = ['parent', 'clinician', 'admin'];

  roles.forEach((role) => {
    it(`has no critical/serious a11y violations on the ${role} dashboard`, () => {
      cy.loginAs(role); // lands on /dashboard and waits for the welcome heading
      auditA11y();
    });
  });
});
