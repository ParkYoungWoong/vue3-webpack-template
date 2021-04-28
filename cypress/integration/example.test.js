it('메인 페이지에서 메시지를 확인합니다', () => {
  cy.visit('/')
  cy.get('h2')
    .contains('Hello')
})
