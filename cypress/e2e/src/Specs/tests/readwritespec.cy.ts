
import {action} from  '../actionspec';
import { generateEmployees } from "../../page-objects/Fakerdata";
import {get_testplan_details,UpdateStatusintoTFS} from "../TFSAPiintegration.cy";
/// <reference types="cypress" />


const actionobj= new action();
describe("My first Test Suite ",{testIsolation:false} ,() => {
 let index=0;
 let status ="FAILED"
 var description;
 var ob1;
 var filename;
 
  
beforeEach('Generating faker data everytime ',()=>{
//Handling failed test
//cy.wrap(failedTest).should('be.undefined')
    // 1.getting faker data generated dynamically using faker,json
    //cy.task('setUserData', "description")
    cy.log("Executing Before each 1. Generating faker data json dynamically " )
    let dataObj = generateEmployees(10);
   cy.writeFile("./cypress/fixtures/fakerdata.json",JSON.stringify(dataObj, null, '\t'));
   if(index==0){
     //2. Fetching tfs  ids and name from respective tfs plan and suite  dynamically and storing into json
    cy.log("*Executing before each 2. Fetching tfs testcases details*")
    cy.writeFile('cypress/fixtures/tfstestsuite.json','[')
    cy.log("Writng into json ")
    get_testplan_details()
    cy.writeFile('cypress/fixtures/tfstestsuite.json',']',{flag:'a+'})
    ++index
    // //3. Getting secret value from keyvault
    // cy.log("**Executing before each 3. Getting the secret key from Azure portal **")
    // get_secret()
   }
})

  it("Reading xlsx and converting into json", () => {
    // reading excel and cover  ting it into readable json through task 
   // getDataFromHtmlWatchlistIntoJson()
    cy.task('readXlsxFile').then((fileContents) => {
      const jsonData =fileContents;
    // yeilded data from xlsx is dynamic creation into json file 
      cy.writeFile(
        "./cypress/fixtures/testData.json",
        JSON.stringify(jsonData, null, 4),
        "utf-8"
      );
      cy.log("Written into json");
    });
  });
  it('read on a  TFS json and Excel input json file', function(){

// converting plan and suite id from excel to  json
cy.task('readTfsDetails').then((fileContents) => {
  const jsonData =fileContents;
// yeilded data from xlsx is dynamic creation into json file 
  cy.writeFile(
    "./cypress/fixtures/tfsdetails.json",
    JSON.stringify(jsonData, null, 4),
    "utf-8"
  );
  cy.log("Written into json");
});

    })
it('Read from excel, Starting execution on Testcases',  {
      retries: {
        runMode: 1,
        openMode: 0,
      },}, function(){
//REading json and defining the calling methods 
    cy.fixture('testData').then((json) => {
    for(let j in json){
      status="FAILED"
      cy.log(json[j].keyword+json[j].runmode)
     description = json[j].description;
    var keyword =json[j].keyword;
    var key_array=keyword.split(",")
    key_array.forEach(element => {
      cy.log("The keyword is L",element)
    });
    var data:string = json[j].data;
    var data_array=data.split(",")
    data_array.forEach(element => {
      cy.log("The data is ",element)
    });
     ob1=json[j].objectName;
    var obj_array=ob1.split(",")
   obj_array.forEach(element => {
    cy.log("The object array is : "+element)
   });
    let runmode =json[j].runmode; 
    if(runmode== "yes"){
      for (let index = 0; index < key_array.length; index++) {  
        keyword=key_array[index]
        ob1=obj_array[index]
        data=data_array[index]
      cy.log('*****Keyword is '+keyword)
      switch (keyword) {
    case 'openbrowser':
        cy.log('inside switch openbrowser   '+  ob1);
        status = actionobj.openbrowser(description,data,runmode,keyword);
        break;
    case 'click':
        cy.log('inside switch click  '+  ob1);
        status = actionobj.click(description,ob1,runmode );
        break; 
    case 'type':
        cy.log('inside switch type  '+  ob1);
        status = actionobj.type(description,ob1,data,runmode);
        break; 
    case 'date':
        cy.log('inside switch date  '+  ob1);
        status = actionobj.date(description,ob1,data,keyword,runmode );
        break; 
    case 'uploadfile':
        cy.log('inside uploadfile '+ob1)
        status = actionobj.uploadfile(description,ob1,data,keyword,runmode);
        break;
    case 'dropdown' : 
        cy.log('inside dropdown  '+ob1)
        status = actionobj.dropdown(description,ob1,data,keyword,runmode)
        break;
    case 'scroll' :
        cy.log('inside scroll  '+ob1)
        status = actionobj.scroll(description,ob1,runmode)
        break;
    }
  }
  }else{
        status="PAUSED"
        cy.log(description + " runmode is set to  " + runmode)
  } 
  
    //logic to store the status of the testcase into TFS Testplan
      // UpdateStatusintoTFS(description,status,ob1,"") 
  }
    })
    
 
  })

  after('Clearing local storage ',function(){

    //if blocked used only when cypress getting failed and stopped 
    if(this.currentTest.state==="failed"){
      cy.log("Printing screenshot")
      cy.screenshot("Failed screenshot"+description+" - Fieldname - "+ob1)
    }
    cy.log(status)
    cy.task('getUserData').then((userData : string) => {
      cy.log("userdata is "+userData);
      if((userData.includes("FAILED"))){
      var desc=userData.split("&&")
      description=desc[0]
      status=desc[1]
      cy.log(description+ "^^^^^^^^^^^^^"+status)
      filename="Failed screenshot "+description
      cy.screenshot(filename)
   //   UpdateStatusintoTFS(description,status,ob1,filename)
      }
      // voila! Stored data between two .spec files
    });
   
   //  description= Cypress.env('description')
    
    
     cy.clearLocalStorage() 
     cy.log("clearing local storage")
  })
});



