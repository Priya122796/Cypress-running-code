//This is spec file, inside your google-search.spec.ts
import {GoogleSearch} from "../page-objects/Automation";
const search = new GoogleSearch();
const dataTransfer = new DataTransfer();
describe('Redirected to naveen automation labss', () => {
    it('Google Search', () => {
    cy.visit('/')
    search.firstsearch().type('Samsung')
    search.searchandenter().type('HTC Touch{enter}');
    search.searchResultswithTimeout().type('ipod nano{enter}')
    search.containscheck().within(($form) =>{
           cy.get('.dropdown-menu').find('button[name="GBP"]').click()    
    })
    search.currencycheck().find('.price').should('contain','£');
    //hovering 
    search.mousemovement().trigger('mouseover','center').click();
    //drag and drop sample website https://x2f9rh.csb.app/?standalone   and   https://simple-drag-drop.glitch.me/
    let val=0;
    while(val!=2){
    search.drag().scrollIntoView().trigger('dragstart', {
        dataTransfer
      });
    search.drop().trigger('drop', {
        dataTransfer
    })
   ++val;
}
  
    });
  
});