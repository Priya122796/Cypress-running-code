// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
// Included to avoid cross origin error 
import 'cypress-file-upload';
// import '@testing-library/cypress/add-commands'
// import '@cypress/code-coverage/support'
Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  });
  //asynchronous call  -custom function, promises ,
//read data from json 
  Cypress.Commands.add("parseXlsx", (inputFile) => {
    return cy.task('parseXlsx', { filePath: inputFile })
    });
// //code coverage
//      module.exports = (on, config) => {
//        on('task', require('@cypress/code-coverage/task'));
//       on('file:preprocessor', require('@cypress/code-coverage/use-babelrc'));
  
//       return config
//   };