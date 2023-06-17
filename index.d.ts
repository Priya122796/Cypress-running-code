export {}
declare global {
   namespace Cypress {
       interface Chainable {
        LoginAzure(): Chainable<void>;
       }
   }
}