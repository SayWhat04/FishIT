describe('App E2E', () => {
  it('should visit the home page', () => {
    cy.visit('/');
    cy.contains('FishIT');
  });

  it('should have basic navigation', () => {
    cy.visit('/');
    // This will need to be updated based on actual navigation elements in the app
    cy.get('nav').should('exist');
  });
}); 