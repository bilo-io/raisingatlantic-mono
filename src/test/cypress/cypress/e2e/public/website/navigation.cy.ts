describe('Public Website Navigation', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('navigates to all top-level pages and asserts content', () => {
        // Home
        cy.get('img').should('have.length.at.least', 1);

        // About
        cy.get('nav').contains('About').click();
        cy.url().should('include', '/about');
        cy.contains('About Raising Atlantic').should('be.visible');

        // Pricing
        cy.visit('/');
        cy.get('nav').contains('Pricing').click();
        cy.url().should('include', '/pricing');
        cy.contains('Simple, Transparent Plans').should('be.visible');

        // Directory
        cy.visit('/');
        cy.get('nav').contains('Search').click();
        cy.url().should('include', '/directory');
        cy.contains('Directory').should('be.visible');

        // Contact
        cy.visit('/');
        cy.get('nav').contains('Contact').click();
        cy.url().should('include', '/contact');
        cy.contains('Get In Touch').should('be.visible');
    });

    it('checks for main CTAs on home page', () => {
        cy.contains('Sign Up').should('be.visible');
        cy.contains('Login').should('be.visible');
    });
});
