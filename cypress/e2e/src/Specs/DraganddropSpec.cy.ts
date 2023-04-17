
import { toArray } from "cypress/types/lodash";
import { FeedbackForm } from "../page-objects/DynSelectors";
import { Selector } from "../page-objects/Selectors";
//import {  } from "cypress-xpath";
export const getselector=function(objname):string {
  const array2 = Object.keys(Selector).map((key) => ({ key , value: Selector[key] }));
  for(let j in array2){
   if(array2[j].key==(objname)){
    cy.log("***Value of  : "+objname+" is : "+array2[j].value)
    return array2[j].value;  
  }
}
};
describe('First successfull testsuite ',{ testIsolation: false }, () => {
it('Open browser', () => {
    cy.visit('https://demoqa.com/')
    cy.screenshot('Entire screen')
   const arrayofenum=Object.keys(Selector)
 
   const objname='form_contains'
  
   arrayofenum.forEach(element => {
    if(element.match('form')){    
      cy.log("Key in array"+element);
    }
  });
 cy.contains(getselector(objname)).click();
}); 
it('Practiceform click', () => {
//  FeedbackForm.practiceform.click();
//   // FeedbackForm.form.click();
//    //FeedbackForm.practiceform.click();
  cy.contains('Practice Form', {timeout: 2000}).click()
    cy.screenshot('Inside Form')
    cy.get('.subjects-auto-complete__value-container').type('Com');


});
});
