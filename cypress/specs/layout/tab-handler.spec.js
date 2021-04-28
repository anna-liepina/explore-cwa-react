describe('User Navigation', () => {
    it('as a user, I should able to see 3 tabs, and having 1st tab selected', () => {
        cy.visit('/');

        cy.get('[data-tab-id]').should('have.length', 3);
        cy.get('[data-tab-id="0"]').should('have.class', 'tab--selected');
    });
});
