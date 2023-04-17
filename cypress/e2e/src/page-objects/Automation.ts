//Inside your google-search.page.ts file. This is pageobject file.
/// <reference types="cypress" />
 
export class GoogleSearch{
    clear(cy){
        return cy.clear()  
    }
    firstsearch(){   
    // this.clear(cy.get('#search > .form-control'))
    return  cy.get('#search > .form-control');
    }
    
    searchandenter(){
    this.clear(cy.get('#search > .form-control'))
     return  cy.get('#search > .form-control');
    }
     searchResultswithTimeout(){
        this.clear(cy.get('#search > .form-control'))
        return cy.get('#search > .form-control', {timeout: 2000});
     }
     containscheck(){
        return cy.get('#form-currency > .btn-group ').click()
     }
     currencycheck(){
        return cy.get('.caption')
     }
     mousemovement(){
      return cy.get('#logo > a > .img-responsive')
     }
     drag(){
      return cy.get('.swiper-slide-active > a > .img-responsive')
      //cy.get('#slideshow0 > .swiper-wrapper > .swiper-slide-active > .img-responsive')
     }
     drop(){
      return cy.get('#slideshow0 > .swiper-wrapper > .swiper-slide-active > .img-responsive')
      //cy.get('#slideshow0 > .swiper-wrapper > .swiper-slide-active > .img-responsive')
     }
     
  }