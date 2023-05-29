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

  export function getPointIDfromAzure(testcaseID,status,planID,suitID){
   //getting testcaseID from TFS using description
   cy.log("The testcase id is "+testcaseID+"\n Status is : "+status)
   //getting Pointid from azure API
   return cy.request({
     method:'GET',
     //https://augusta-coderepo.com/Client_Project_2023/Paradigm_Adva_Pro/_apis/test/plans/872/suites/921/points?testcaseId=928&api-version=5.1
     url:'https://augusta-coderepo.com/Client_Project_2023/Paradigm_Adva_Pro/_apis/test/plans/'+planID+'/suites/'+suitID+'/points?testcaseID='+testcaseID+'&api-version=5.1',
     headers: {
         authorization: 'Basic OjRhNWFqc2hjenBob3dkam53Y3BzbWEyNGE2emdmYWNteXZ2ajZoZHNrYTV0YXhsZnZqeWE='
       },
 }).then(response => {
   expect(response.status).to.equal(200)
   console.log ("the point id is : "+response.body.value[0].id)
   return response.body.value[0].id
 })
 }

   export function createRun(pointID,planID,description){
      //https://augusta-coderepo.com/Client_Project_2023/Paradigm_Adva_Pro/_apis/test/runs?api-version=7.0
      return cy.request({
         method:'POST',
         url : 'https://augusta-coderepo.com/Client_Project_2023/Paradigm_Adva_Pro/_apis/test/runs?api-version=7.0',
         headers: {
            authorization: 'Basic OjRhNWFqc2hjenBob3dkam53Y3BzbWEyNGE2emdmYWNteXZ2ajZoZHNrYTV0YXhsZnZqeWE=',
          },
         body :
         {
            "name": description+new Date(),
            "plan": {
              "id": planID
             },
            "pointIds": [
              pointID   
            ]
          }
      }).then(response=>{
         cy.log(response.toString())
         //expect(response.status).to.equal(200)
         cy.log(response.body.id)
         return response.body.id
      })
    }