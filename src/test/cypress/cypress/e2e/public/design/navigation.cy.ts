describe('Design System Navigation', () => {
    it('navigates to Branding page in Design System', () => {
        cy.visit('/');
        cy.get('footer').contains('Design System').click();
        cy.url().should('include', '/design-system/branding');
        cy.get('h1').should('be.visible');
    });
});
