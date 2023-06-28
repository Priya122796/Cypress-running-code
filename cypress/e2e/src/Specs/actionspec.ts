//import { FeedbackForm } from "../page-objects/DynSelectors";
//import RegExp from "typescript-dotnet-commonjs/System/Text/RegularExpressions";

///<reference types="cypress"/>
import { get } from "cypress/types/lodash";
import { Selector } from "../page-objects/Selectors";
import { highlight } from 'cypress-highlight'

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
      // cy.task('get_secret').then((element:string) => {
      //   cy.log("Secret value is : "+element)
      // })
      cy.LoginAzure()
      cy.screenshot(keyword)
      this.set_variable(description,"PASSED")
      runmode="PASSED"
      return runmode
  }
  assert =(description,data,objname,runmode)=>{
    // cy.log(Object.values(objname))
    description=description+" Fieldname - "+ objname
    cy.log("****************assert method : "+description,data,objname)
    runmode="FAILED"
    this.set_variable(description,"FAILED")
    var regex : string = objname
    if(regex===("url")){
      cy.log("Expected result : "+data)
      cy.url({timeout:5000}).should('eq',data)
      this.set_variable(description,"PASSED")
      runmode="PASSED"
     // cy.screenshot(regex)
    }else if(regex.includes('contains')) {
      cy.log("Inside contains assert "+description+"\n expected data is :"+data)
      cy.contains(getselector(regex)).should('contain.text',data);
      highlight(getselector(objname))
     // cy.screenshot(regex)
      runmode="PASSED"
      this.set_variable(description,"PASSED")
    }
      else{
      cy.log("Inside get assert "+description+"\n expected data is :"+data)
      cy.get(getselector(regex)).should('contain.text',data);
      highlight(getselector(objname))
     // cy.screenshot(regex)
      runmode="PASSED"
      this.set_variable(description,"PASSED")
    }
     return runmode
 }

//click action with get and contains
  click=(description,objname,runmode)=>{
   // cy.log(Object.values(objname))
   description=description+" Fieldname - "+ objname
   this.set_variable(description,"FAILED")
    var regex : string = objname
   // let regex = new  RegEx('bc*d')
    if(regex.includes("contains")){
    cy.log("Inside contains"+description+"\n"+objname)
    cy.contains(getselector(objname)).click({force:true});
    highlight(getselector(objname))
   // cy.screenshot(objname)
    runmode="PASSED"
    return runmode
    }else{
    cy.log("Inside get"+description+"\n"+objname)
    cy.get(getselector(objname)).click({force:true})
    highlight(getselector(objname))
   // cy.screenshot(objname)
    this.set_variable(description,"PASSED")
    runmode="PASSED"
    return runmode
    }
}
//type method 
type=(description,objname,data,runmode)=>{
  description=description+" Fieldname - "+ objname
  this.set_variable(description,"FAILED")
    if(data.includes( "faker")){
      //handling error and complete run without failing the execution 
      Cypress.on('fail', (error, runnable) => {
         if (!error.message.includes(' but never found it')) {
        cy.log(error.message)
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
        if(data.includes('contains')){
          cy.contains(getselector(objname)).type(userdata)
        } else{
          cy.get(getselector(objname)).type(userdata)
        }
        highlight(getselector(objname))
         
     // cy.screenshot(objname)
      })
      this.set_variable(description,"PASSED")
      runmode="PASSED"
      return runmode
     }
  
   
}
// date button check method
date=(description,objname,data,keyword,runmode)=>{
  description=description+" Fieldname - "+ objname
  this.set_variable(description,"FAILED")
  var regex : string = objname
  if(regex.includes("date")){
    cy.log("Inside date check "+ description+"\n"+objname+ "\n"+data+"\n"+keyword) 
    cy.get(getselector(objname)).click({force:true});
    cy.fixture('fakerdata').then((json) => {
      //getting random data from json from 9
      let n1 : number = Math.floor(Math.random() * 10) 
      var v1 = json[n1]
        userdata=v1[objname]
        cy.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%^The faker userdata is : "+ userdata)
      var v2=userdata.substring(0,10)
      cy.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%^The trimmed  userdata is : "+ v2)
    cy.get(getselector(objname)).type(v2)
    highlight(getselector(objname))
    })
   // cy.screenshot(objname)
    this.set_variable(description,"PASSED")
    runmode="PASSED"
    return runmode
}
}
//uploading file from cypress-file-upload external package 
uploadfile=(description,objname,data,keyword,runmode)=>{
  description=description+" Fieldname - "+ objname
  this.set_variable(description,"FAILED") 
  var regex : string = objname
  if(regex.includes("upload")){
    cy.log("Inside uploadfile check "+ description+"\n"+objname+ "\n"+data+"\n"+keyword) 
    cy.get(getselector(objname)).attachFile(data)
    highlight(getselector(objname))
   // cy.screenshot(objname)
    runmode="PASSED"
    this.set_variable(description,"PASSED")
    return runmode
}
}
//selecting dynamic dropdown by type,search,select
dropdown=(description,objname,data,keyword,runmode)=>{
  description=description+" Fieldname - "+ objname
  this.set_variable(description,"FAILED")
  var arr:[]=data.split(',')
  var regex : string = objname
  if(regex.includes("subject")){
    cy.log("Inside dynamic dropdown check "+ description+"\n"+objname+ "\n"+data)
    //Search and enter two dynamic data
    arr.forEach(element => {
      //handling dynamic dropdown [without select tag]with tab key 
       cy.get(getselector(objname)).type(element+'{downArrow}{enter}')
       highlight(getselector(objname))
   // cy.screenshot(objname)
    });
    //removing added last dropdown selection  without select tag
  //  cy.get(getselector(keyword)).should('be.visible').click({force:true});
   // cy.screenshot(objname)

    this.set_variable(description,"PASSED")
    runmode="PASSED"
    return runmode
  }else if (regex.includes("state")){
    cy.log("Inside select dropdown check "+ description+"\n"+objname);
    cy.get(getselector(objname)).type(data+'{enter}')
    highlight(getselector(objname))
   // cy.screenshot(objname)
 
    this.set_variable(description,"PASSED")
    runmode="PASSED"
    return runmode
  }else{
    cy.log("Inside select dropdown check "+ description+"\n"+objname);
    cy.get(getselector(objname)).type(data+'{downArrow}{enter}'+'{enter}')
    highlight(getselector(objname))
   // cy.screenshot(objname)
    this.set_variable(description,"PASSED")
    return runmode
  }
}

//Scroll to the last element
scroll=(description,objname,runmode)=>{
  description=description+" Fieldname - "+ objname
  this.set_variable(description,"FAILED")
  var regex : string = objname
  cy.log("Inside contains"+description+"\n"+objname)
  cy.contains(getselector(objname)).scrollIntoView()
 // cy.screenshot(objname)
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