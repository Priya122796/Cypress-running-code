import { Selector } from "../page-objects/Selectors";




describe('LOGIN Sanity Testcase',()=>{
  //beforeEach('Testing login in before each',*)
//getting selector from Enum 
const getselector=function(objname) {
  const array2 = Object.keys(Selector).map((key) => ({ key , value: Selector[key] }));
  for(let j in array2){
   if(array2[j].key==(objname)){
    cy.log("***Value of  : "+objname+" is : "+array2[j].value)
    return array2[j].value;  
  }    
}
}
    it('Login into AdvaPro dev01 app',  {
      retries: {
        runMode: 1,
        openMode: 0,
      },}, function(){  
       //Clearing previous session,local and cache storage 
        cy.clearAllLocalStorage()
        cy.clearAllCookies()
        cy.clearAllSessionStorage() 
        cy.visit("https://adva-pro-dev01.paradigmcentral.com/#/")
        cy.get(getselector('login')).click({timeout:2000});
            
       //Login to your AAD tenant.
         cy.LoginAzure(); 
       cy.get(getselector('client_menu')).first().should('be.visible').click({timeout:8000})
       cy.screenshot("Client Menu",{timeout:4000})
       var element= 'liyan'
       cy.get("#searchBox").type(element+'{downarrow}{enter}',{force:true})
       cy.screenshot('search done ')
       cy.get(':nth-child(1) > .cdk-column-clientName > .mat-link > .mat-header-value').should('be.visible').click()
       cy.get(getselector('instruction')).should('be.visible').click()
       cy.get(getselector('next')).should('be.visible').click()
       cy.screenshot()
       cy.get(getselector('close_popup')).click()
      //  cy.get('#file-selector').click()
      //  cy.get('#upload-doc-cont > h3 > label').should('contain.text','Upload Document')
      // cy.get(getselector('tag')).find('#tag-select').should('be.visible').click({force:true})
      
       //
        // cy.contains(getselector('create_contains')).click({timeout:2000})
        // cy.get(getselector('client_text')).should('contain.text','Create New Client').screenshot('Assertion')
        // cy.get(getselector('client_name')).type('Andrew')
        // cy.get(getselector('save')).click()
        // cy.get(getselector('next')).click()
    })
    
})