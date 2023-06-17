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
    it('Login into AdvaPro dev01 app',()=>{  
       //Clearing previous session,local and cache storage 
        cy.clearAllLocalStorage()
        cy.clearAllCookies()
        cy.clearAllSessionStorage() 
        cy.visit("https://adva-pro-dev01.paradigmcentral.com/#/")
        cy.get(getselector('login')).click({timeout:2000});
            
       //Login to your AAD tenant.
        cy.LoginAzure(); 
        cy.get(getselector('mainmenu')).first().should('be.visible').click({timeout:8000})
        cy.screenshot("Client Menu",{timeout:4000})
    })
    after('Clearing local storage',()=>{
      cy.clearAllLocalStorage()
        cy.clearAllCookies()
        cy.clearAllSessionStorage() 
    })
})