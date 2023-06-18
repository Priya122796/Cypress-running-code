///<reference types="cypress"/>
// Name: LoginAzure
// Description: Login into the ADvapro application using Automation credentails 
// Prerequisite: visit advapro url and click login button  
Cypress.Commands.add('LoginAzure', function () {
    cy.get('#logintag').click({timeout:2000});
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
            cy.get('#idBtn_Back').click({timeout:7000})
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
  
  
  