describe('Legal Pages Navigation', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('navigates to Privacy Policy from footer', () => {
        cy.get('footer').contains('Privacy Policy').click();
        cy.url().should('include', '/legal/privacy-policy');
        cy.get('h1').should('be.visible');
    });

    it('navigates to Terms of Service from footer', () => {
        cy.get('footer').contains('Terms of Service').click();
        cy.url().should('include', '/legal/terms-of-service');
        cy.get('h1').should('be.visible');
    });

    it('navigates to EULA from footer', () => {
        cy.get('footer').contains('EULA').click();
        cy.url().should('include', '/legal/eula');
        cy.get('h1').should('be.visible');
    });
});
