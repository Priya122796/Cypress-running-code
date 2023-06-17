// Name: LoginAzure
// Description: Login into the ADvapro application using Automation credentails 
// Prerequisite: none 
Cypress.Commands.add('LoginAzure', function () {

    var username='OpsAdvaQAAutomation@paradigmcorp.com',
    password='CoffeeTrainEarthWater'
    cy.origin(
        'https://login.microsoftonline.com/',
        {
          args: {
            username,
            password
          },
        },
        ({ username, password }) => {
          
          // 
          //
          cy.wait(7000)
          cy.get('#idBtn_Back',{timeout:4000}).click()
          cy.get('#otherTileText').click({timeout:3000})
          cy.get('input[type="email"]').type(username, {
            log: false,
          })
          cy.screenshot()
          cy.get('input[type="submit"]').click()
          cy.wait(6000)
          cy.get('input[type="password"]').type(password)
                      
                    cy.get('input[type="submit"]').click()
                   // cy.screenshot("After Login screen ",{timeout:2000})

                 
        })
})//end of LoginAzure cmd 


