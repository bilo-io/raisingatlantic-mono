import { auditA11y } from '../../support/a11y';

// Automated accessibility audit of the public marketing + legal pages
// (DEV.md §12.2). Complements the Lighthouse a11y check with axe-core rules.
describe('Public pages — accessibility (axe-core)', () => {
  const pages = [
    '/',
    '/about',
    '/pricing',
    '/contact',
    '/legal/privacy-policy',
    '/legal/terms-of-service',
    '/legal/eula',
  ];

  pages.forEach((path) => {
    it(`has no critical/serious a11y violations: ${path}`, () => {
      cy.visit(path);
      auditA11y();
    });
  });
});
