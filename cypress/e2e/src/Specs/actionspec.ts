//import { FeedbackForm } from "../page-objects/DynSelectors";
//import RegExp from "typescript-dotnet-commonjs/System/Text/RegularExpressions";

///<reference types="cypress"/>
import { Selector } from "../page-objects/Selectors";

//enum to array of Selectors  conversion
let userdata : any ;
 const getselector=function(objname):string {
   const array2 = Object.keys(Selector).map((key) => ({ key , value: Selector[key] }));
   for(let j in array2){
    if(array2[j].key==(objname)){
     cy.log("***Value of  : "+objname+" is : "+array2[j].value)
     return array2[j].value;  
   }
   
 }
}

/**
 * 
 * 
 * 
 * @export
 * @class action
 */
export class action {
  //Opening browser method
  openbrowser=(description,data,runmode,keyword)=>{
    description=description+" Fieldname - "+keyword
    this.set_variable(description,"FAILED")
      cy.log('in Browser')
      cy.clearAllLocalStorage()
      cy.clearAllCookies()
      cy.clearAllSessionStorage()
      cy.visit(data)
      cy.LoginAzure()
      cy.screenshot(description)
      this.set_variable(description,"PASSED")
      runmode="PASSED"
      return runmode
  }
  mfalogin =(description,objname,runmode)=>{
    // cy.log(Object.values(objname))
    description=description+"   Fieldname - "+objname+" "
    this.set_variable(description,"FAILED")
 
    cy.LoginAzure()
     this.set_variable(description,"PASSED")
     runmode="PASSED"
     return runmode
 }

//click action with get and contains
  click=(description,objname,runmode)=>{
   // cy.log(Object.values(objname))
   description=description+"   Fieldname - "+objname+" "
   this.set_variable(description,"FAILED")
    var regex : string = objname
   // let regex = new  RegEx('bc*d')
    if(regex.includes("contains")){
    cy.log("Inside contains"+description+"\n"+objname)
    cy.contains(getselector(objname)).click();
    cy.screenshot(description)
    runmode="PASSED"
    return runmode
    }else{
    cy.log("Inside get"+description+"\n"+objname)
    cy.get(getselector(objname)).click()
    cy.screenshot(description)
    this.set_variable(description,"PASSED")
    runmode="PASSED"
    return runmode
    }
}
//type method 
type=(description,objname,data,runmode)=>{
  description=description+"   Fieldname - "+objname+" "
  this.set_variable(description,"FAILED")
    if(data.includes( "faker")){

      // if(objname.includes("last"))
      // cy.task('setUserData', description)
      //handling error and complete run without failing the execution 
      Cypress.on('fail', (error, runnable) => {
       // this.failed_cases(description)
         if (!error.message.includes(' but never found it')) {
     // cy.task('setValue', { key: 'description', value: description })
        cy.log(error.message)
       // Cypress.env('description', description)
       return false
        
      }
      })
      cy.log("Inside get"+description+"\n"+objname) 
      //reading data from fixture .json file 
      cy.fixture('fakerdata').then((json) => {
        //getting random data from json from 9
        let n1 : number = Math.floor(Math.random() * 10) 
        var v1 = json[n1]
          userdata=v1[objname]
          //.map(item=>item[1] ) - value returns in map 
        cy.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%^The faker userdata is : "+ userdata)
      cy.get(getselector(objname)).type(userdata)
      
         
      cy.screenshot(description)
      })
      this.set_variable(description,"PASSED")
      runmode="PASSED"
      return runmode
     }
  
   
}
// radio button check method
date=(description,objname,data,keyword,runmode)=>{
  description=description+"   Fieldname - "+objname+" "
  this.set_variable(description,"FAILED")
  var regex : string = objname
  if(regex.includes("dob")){
    cy.log("Inside date check "+ description+"\n"+objname+ "\n"+data+"\n"+keyword) 
    cy.get(getselector(objname)).click();
    cy.fixture('fakerdata').then((json) => {
      //getting random data from json from 9
      let n1 : number = Math.floor(Math.random() * 10) 
      var v1 = json[n1]
        userdata=v1[objname]
      cy.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%^The faker userdata is : "+ userdata)
    cy.get(getselector(objname)).type('{selectall}'+userdata+'{enter}')
   
    })
    cy.screenshot(description)
    this.set_variable(description,"PASSED")
    runmode="PASSED"
    return runmode
}
}
//uploading file from cypress-file-upload external package 
uploadfile=(description,objname,data,keyword,runmode)=>{
  description=description+"   Fieldname - "+objname+" "
  this.set_variable(description,"FAILED") 
  var regex : string = objname
  if(regex.includes("upload")){
    cy.log("Inside uploadfile check "+ description+"\n"+objname+ "\n"+data+"\n"+keyword) 
    cy.get(getselector(objname)).attachFile(data)
    cy.screenshot(description)
    runmode="PASSED"
    this.set_variable(description,"PASSED")
    return runmode
}
}
//selecting dynamic dropdown by type,search,select
dropdown=(description,objname,data,keyword,runmode)=>{
  description=description+"   Fieldname - "+objname+" "
  this.set_variable(description,"FAILED")
  var arr:[]=data.split(',')
  var regex : string = objname
  if(regex.includes("subject")){
    cy.log("Inside dynamic dropdown check "+ description+"\n"+objname+ "\n"+data)
    //Search and enter two dynamic data
    arr.forEach(element => {
      //handling dynamic dropdown [without select tag]with tab key 
       cy.get(getselector(objname)).type(element+'{downArrow}{enter}')
    //  cy.get(keyword).should('be.visible').click();
    cy.screenshot(description)
    });
    //removing added last dropdown selection  without select tag
    cy.get(getselector(keyword)).should('be.visible').click({force:true});
    cy.screenshot(description)

    this.set_variable(description,"PASSED")
    runmode="PASSED"
    return runmode
  }else if (regex.includes("state")){
    cy.log("Inside select dropdown check "+ description+"\n"+objname);
    cy.get(getselector(objname)).type(data+'{downArrow}{enter}')
    cy.screenshot(description+"   "+objname)
 
    this.set_variable(description,"PASSED")
    runmode="PASSED"
    return runmode
  }else{
    cy.log("Inside select dropdown check "+ description+"\n"+objname);
    cy.get(getselector(objname)).type(data+'{downArrow}{enter}'+'{enter}')
    cy.screenshot(description+"   "+objname)
    this.set_variable(description,"PASSED")
    return runmode
  }
}

//Scroll to the last element
scroll=(description,objname,runmode)=>{
  description=description+"   Fieldname - "+objname+" "
  this.set_variable(description,"FAILED")
  var regex : string = objname
  cy.log("Inside contains"+description+"\n"+objname)
  cy.contains(getselector(objname)).scrollIntoView()
  cy.screenshot(description)
  this.set_variable(description,"PASSED")
  runmode="PASSED"
  return runmode
}

set_variable=(description,status)=>{
var desc=description+"&&"+status
cy.log("Setting variable is : "+desc)
cy.task('setUserData', desc) 
}

}
