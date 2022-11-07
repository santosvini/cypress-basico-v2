/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
  const THREE_SECONDS_IN_MS = 3000;
  beforeEach(function() {
    cy.visit('./src/index.html');
  });

  it('Verifica o título da aplicação', function() {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT');
  })

  it('Preencher os campos obrigatórios e envia o formulário', function() {
    const longText = 'Teste teste teste teste teste teste teste teste teste teste teste teste teste teste teste teste teste teste teste teste teste teste teste teste teste teste teste teste test  e teste teste teste teste teste teste teste test'

    cy.clock()

    cy.get('input[id="firstName"]').type('Vinicius')
    cy.get('input[id="lastName"]').type('Santos')
    cy.get('input[id="email"]').type('vini_santos7@live.com')
    cy.get('textarea[id="open-text-area"]').type(longText, {delay: 0})
    cy.contains('button', 'Enviar').click()

    cy.get('.success').should('be.visible')

    cy.tick(THREE_SECONDS_IN_MS)

    cy.get('.success').should('not.be.visible')
  })

  it('Exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {
    cy.clock()

    cy.get('input[id="firstName"]').type('Vinicius')
    cy.get('input[id="lastName"]').type('Santos')
    cy.get('input[id="email"]').type('vini_santos7@live,com')
    cy.get('textarea[id="open-text-area"]').type('Gostaria de conhecer Cypress', {delay: 0})
    cy.contains('button', 'Enviar').click()

    cy.get('.error').should('be.visible')

    cy.tick(THREE_SECONDS_IN_MS)

    cy.get('.error').should('not.be.visible')
  })

  Cypress._.times(5, function() {
    it('Campo telefone vazio com valor não-númerico', function() {
      cy.get('input[id="phone"]').type('abcde').should('have.value', '')
    })
  })

  it('Exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function() {
    cy.clock()
    cy.get('input[id="firstName"]').type('Vinicius')
    cy.get('input[id="lastName"]').type('Santos')
    cy.get('input[id="email"]').type('vini_santos7@live.com')
    cy.get('#phone-checkbox').click()
    cy.get('textarea[id="open-text-area"]').type('Gostaria de conhecer Cypress', {delay: 0})
    cy.contains('button', 'Enviar').click()
    cy.get('.error').should('be.visible')

    cy.tick(THREE_SECONDS_IN_MS)

    cy.get('.error').should('not.be.visible')
  })

  it('Preenche e limpa os campos nome, sobrenome, email e telefone', function() {
    cy.get('input[id="firstName"]').type('Vinicius').should('have.value', 'Vinicius').clear().should('have.value', '')
    cy.get('input[id="lastName"]').type('Santos').should('have.value', 'Santos').clear().should('have.value', '')
    cy.get('input[id="email"]').type('vini_santos7@live.com').should('have.value', 'vini_santos7@live.com').clear().should('have.value', '')
    cy.get('input[id="phone"]').type('956092628').should('have.value', '956092628').clear().should('have.value', '')
  })

  it('Exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function() {
    cy.clock()
    cy.contains('button', 'Enviar').click()
    cy.get('.error').should('be.visible')

    cy.tick(THREE_SECONDS_IN_MS)

    cy.get('.error').should('not.be.visible')
  })

  it('Envia o formulário com sucesso usando um comando customizado', function() {
    cy.clock()
    cy.fillMandatoryFieldsAndSubmit()
    cy.get('.success').should('be.visible')

    cy.tick(THREE_SECONDS_IN_MS)

    cy.get('.success').should('not.be.visible')
  })

  it('Seleciona um produto (YouTube) por seu texto', function() {
    cy.get('#product').select('youtube').should('have.value', 'youtube')
  })

  it('Seleciona um produto (Mentoria) por seu valor', function() {
    cy.get('#product').select('Mentoria').should('have.value', 'mentoria')
  })

  it('Seleciona um produto (Blog) por seu índice', function() {
    cy.get('#product').select(1).should('have.value', 'blog')
  })

  it('Marca o tipo de atendimento "Feedback"', function() {
    cy.get('input[value="feedback"]').check().should('have.value', 'feedback');
  })

  it('Marca cada tipo de atendimento', function() {
    cy.get('input[type="radio"]').should('have.length', 3).each(($name) => {
      cy.wrap($name).check()
      cy.wrap($name).should('be.checked')
    })
  })

  it('Marca ambos os checkbox, depois desmarca o último', function() {
    cy.get('#check input[type="checkbox"]').check().should('be.checked').last().uncheck().should('be.not.checked')
  })

  it('Exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function() {
    cy.clock()
    cy.get('input[id="firstName"]').type('Vinicius').should('be.visible')
    cy.get('input[id="lastName"]').type('Santos').should('be.visible')
    cy.get('input[id="email"]').type('vini_santos7@live.com').should('be.visible')
    cy.get('#phone-checkbox').check().should('be.visible')
    cy.get('textarea[id="open-text-area"]').type('Gostaria de conhecer Cypress', {delay: 0}).should('be.visible')
    cy.contains('button', 'Enviar').click().should('be.visible')
    cy.get('.error').should('be.visible')

    cy.tick(THREE_SECONDS_IN_MS)

    cy.get('.error').should('not.be.visible')
  })

  it('Seleciona um arquivo da pasta fixtures', function() {
    cy.get('input[id="file-upload"]')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/example.json')
        .then(input => {
          expect(input[0].files[0].name).to.equal('example.json')
      });
  })

  it('Seleciona um arquivo simulando um drag-and-drop', () => {
    cy.get('input[id="file-upload"]')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' })
        .then(input => {
          expect(input[0].files[0].name).to.equal('example.json')
    })
  })

  it('Seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function() {
    cy.fixture('example.json').as('exampleFile')
    cy.get('input[id="file-upload"]')
      .selectFile('@exampleFile')
      .should('not.have.value')
      .then(input => {
        expect(input[0].files[0].name).to.equal('example.json')
    })
  })

  it('Verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function () {
    cy.get('a[href="privacy.html"]').should('have.attr', 'target', '_blank')
  })

  it('Acessa a página da política de privacidade removendo o target e então clicando no link', function () {
    cy.get('a[href="privacy.html"]').invoke('removeAttr', 'target').click()
    cy.contains('Talking About Test').should('be.visible')
  })

  it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', function() {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible')
    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  })

  it('Preenche a área de texto usando o comando invoke', function() {
    const longText = Cypress._.repeat('0123456789', 20)

    cy.get('#open-text-area').invoke('val', longText).should('have.value', longText)
  })

  it('Faz uma requisição HTTP', function() {
    cy.request({
      method: 'GET',
      url: 'https://cac-tat.s3.eu-central-1.amazonaws.com/index.html'
    }).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.statusText).to.equal('OK')
        expect(response.body).to.include('CAC TAT')
    })
  })

  it('Encontre o gato escondido', function () {
    cy.clock()
    cy.get('span#cat')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .contains('🐈')
    cy.get('#title')
      .invoke('text', 'CAT TAT')
    cy.get('#subtitle')
      .invoke('text', 'Eu ❤️ gatos!')
  })
})
