describe('Private Dashboard Navigation', () => {
    beforeEach(() => {
        cy.viewport(1280, 720); // Force desktop viewport
        cy.visit('/');
    });

    it('navigates from home to login page', () => {
        // Using a more robust selector that works for the desktop layout
        cy.get('header').find('a[href="/login"]').last().click();
        cy.url().should('include', '/login');
        cy.contains('Welcome Back').should('be.visible');
    });

    it('navigates from home to signup page', () => {
        cy.get('header').find('a[href="/signup"]').last().click();
        cy.url().should('include', '/signup');
        cy.contains('Create an Account').should('be.visible');
    });
});
