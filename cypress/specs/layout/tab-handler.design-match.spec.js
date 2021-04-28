describe('DESIGN MATCH - User Navigation',   {
    viewportHeight: 1000,
    viewportWidth: 1600,
  }, () => {
    it('as I user, I expect tabs to be responsive', () => {
        cy
            .fixture('screen_breakpoints')
            .then((matrix) => {
                cy.visit('/');

                for (const [label, width] of matrix) {
                    cy
                        .viewport(parseInt(width, 10), 1000)
                    cy
                        .get('.tab-handler')
                        .matchImageSnapshot(`tab-handler--${width}px-${label}`);
                }
            })
    });
});
