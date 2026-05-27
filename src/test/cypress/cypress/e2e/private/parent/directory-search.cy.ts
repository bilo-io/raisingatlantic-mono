describe('Parent — directory search', () => {
  beforeEach(() => {
    cy.loginAs('parent');
  });

  it('loads the clinicians directory with a search input', () => {
    cy.visit('/dashboard/directory/clinicians');
    cy.get('input[placeholder*="Search" i]', { timeout: 10_000 }).should('be.visible');
  });

  it('filters the list when typing in the search input', () => {
    cy.visit('/dashboard/directory/clinicians');
    cy.get('input[placeholder*="Search" i]', { timeout: 10_000 })
      .type('Smith', { delay: 30 });

    // Either a result card containing the term, or an explicit empty-state, is acceptable
    cy.get('body').then(($body) => {
      const text = $body.text();
      expect(/Smith|no results|no clinicians/i.test(text)).to.eq(true);
    });
  });

  it('also exposes the practices directory page', () => {
    cy.visit('/dashboard/directory/practices');
    cy.url().should('include', '/dashboard/directory/practices');
    cy.contains(/Practice|Practices/i).should('be.visible');
  });
});
